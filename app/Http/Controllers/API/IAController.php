<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IAController extends Controller
{
    /**
     * Endpoint: /api/ia/chat
     * مساعد ذكي مخصص لمنصة تنظيم الأعراس المغربية (متوافق مع العرض 100%)
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $userMessage = $request->input('message');
        $msgLower = mb_strtolower($userMessage, 'UTF-8');
        $apiKey = env('GEMINI_API_KEY');

        // 🎯 1. السيستم المحلي الذكي (Comprehensive Knowledge Base)
        // هذا غايفيض بالمعلومات على البروجي ديالك ويجاوب على أي حاجة بدقة لو طاحت الـ API
        $backupReply = null;

        // الرادار 1: الترحيب والتعريف بالمنصة
        if (str_contains($msgLower, 'bonjour') || str_contains($msgLower, 'hello') || str_contains($msgLower, 'سلام') || str_contains($msgLower, 'hi')) {
            $backupReply = "Bonjour et bienvenue sur notre plateforme ! 🌸 Je suis **WeddingBot**, votre assistant virtuel dédié.\n\n"
                         . "Je suis conçu spécialement pour vous guider dans notre application. Vous pouvez :\n"
                         . "• Explorer les **Salles de fêtes** disponibles.\n"
                         . "• Découvrir les **Packs** et formules de nos prestataires.\n"
                         . "• Demander des **Devis en ligne** et suivre leur statut en temps réel.\n\n"
                         . "Comment puis-je vous aider dans vos préparatifs aujourd'hui ?";
        }
        
        // الرادار 2: الميزانية والأثمنة (Budget)
        elseif (str_contains($msgLower, 'budget') || str_contains($msgLower, 'فلوس') || str_contains($msgLower, 'ثمن') || str_contains($msgLower, 'prix') || str_contains($msgLower, 'cher')) {
            $backupReply = "La gestion du budget est une fonctionnalité clé de notre plateforme ! 💰\n\n"
                         . "• **Répartition conseillée :** 45% Traiteur & Salle, 15% Negafa, 15% Orchestre/Animation, 10% Photo & Vidéo.\n"
                         . "• **Sur notre site :** Vous pouvez filtrer les prestataires selon vos capacités financières et demander un **Devis personnalisé** gratuit via le bouton 'Demander un devis' sur la page de chaque salle.\n\n"
                         . "Quel est votre budget global pour que je vous suggère la meilleure stratégie ?";
        }

        // الرادار 3: القاعات (Salles) والحجز
        elseif (str_contains($msgLower, 'salle') || str_contains($msgLower, 'قاعة') || str_contains($msgLower, 'بلاصة') || str_contains($msgLower, 'espace')) {
            $backupReply = "Vous cherchez l'endroit idéal ? 🏰 Notre plateforme regroupe les meilleures salles (Villas, Salles des fêtes, Riads).\n\n"
                         . "• **Comment ça marche ?** Allez sur l'onglet **Marketplace / Salles**, choisissez la ville et la capacité d'invités.\n"
                         . "• **Disponibilité :** Vous pouvez consulter le calendrier en temps réel pour voir si la salle est libre à la date de votre mariage avant d'envoyer votre demande.";
        }

        // الرادار 4: الـ Devis والطلبات (كيربط البوت بخدمات البروجي)
        elseif (str_contains($msgLower, 'devis') || str_contains($msgLower, 'طلب') || str_contains($msgLower, 'facture') || str_contains($msgLower, 'commander')) {
            $backupReply = "Sur notre application, la gestion des **Devis** est entièrement automatisée ! 📑\n\n"
                         . "1. **Pour le Client :** Vous choisissez une formule (Or, Argent, Bronze) ou une salle, et vous cliquez sur 'Demander un devis'. Vous pouvez suivre l'état (**En attente, Accepté, Refusé**) depuis votre espace client.\n"
                         . "2. **Pour le Prestataire :** Il reçoit une notification, consulte les détails de votre événement (date, nombre de tables) et met à jour le statut.\n\n"
                         . "Avez-vous un devis en cours à vérifier ?";
        }

        // الرادار 5: الـ Packs والخدمات المتكاملة
        elseif (str_contains($msgLower, 'pack') || str_contains($msgLower, 'offres') || str_contains($msgLower, 'formule') || str_contains($msgLower, 'باك')) {
            $backupReply = "Nous proposons des **Packs sur mesure** pour vous faciliter la vie ! 🎁\n\n"
                         . "• Les prestataires créent des formules tout-compris (par exemple : Salle + Traiteur + Negafa) à des prix compétitifs.\n"
                         . "• Vous pouvez consulter ces offres dans l'onglet **Packs**, comparer les services inclus et réserver directement.\n\n"
                         . "Souhaitez-vous une formule économique ou de haute couture ?";
        }

        // الرادار 6: طريقة عمل المنصة / الأدوار (Client, Prestataire, Admin) - مهم بزاف للجنة!
        elseif (str_contains($msgLower, 'application') || str_contains($msgLower, 'site') || str_contains($msgLower, 'كيفاش') || str_contains($msgLower, 'projet') || str_contains($msgLower, 'role')) {
            $backupReply = "Notre projet est une plateforme bilatérale d'organisation de mariages. Elle gère 3 profils distincts : 👥\n\n"
                         . "• **Le Client :** Explore, filtre, consulte les disponibilités sur l'agenda, et demande des devis.\n"
                         . "• **Le Prestataire (Salle, Traiteur...) :** Crée son profil, expose ses formules, gère son calendrier de disponibilité et répond aux devis.\n"
                         . "• **L'Admin :** Valide l'inscription des prestataires sérieux (sécurité) et accède au tableau de bord (statistiques des ventes et utilisateurs).\n\n"
                         . "C'est un système complet pour digitaliser le mariage marocain !";
        }

        // الرادار 7: النكافة والطريطور والأوركسترا
        elseif (str_contains($msgLower, 'traiteur') || str_contains($msgLower, 'طريطور') || str_contains($msgLower, 'negafa') || str_contains($msgLower, 'نكافة') || str_contains($msgLower, 'orchestre')) {
            $backupReply = "👑 **Les Prestataires de Prestige :**\n"
                         . "• **Traiteur :** Gère le menu (Pastilla, Méchoui). Sur le site, chaque formule affiche le prix par table ou par personne.\n"
                         . "• **Negafa :** S'occupe de la Amariya et des tenues traditionnelles.\n"
                         . "• Vous pouvez les contacter et combiner leurs services via nos **Packs personnalisés**.";
        }

        // جواب عام ذكي يخص الأعراس إذا لم يطابق أي كلمة مفتاحية فوق
        if (!$backupReply) {
            $backupReply = "C'est une excellente question pour l'organisation de votre mariage ! ✨\n\n"
                         . "En tant que WeddingBot, je vous conseille de vérifier cette option directement sur notre application :\n"
                         . "• Consultez les profils des prestataires certifiés dans le **Marketplace**.\n"
                         . "• Testez les simulations de prix en demandant un **Devis** en un clic.\n\n"
                         . "Que voulez-vous savoir de plus sur les fonctionnalités de notre projet ?";
        }

        // 🎯 2. محاولة جلب ذكاء إضافي وديناميكي من Gemini (إذا كانت الـ API شغالة)
        if (!$apiKey) {
            return response()->json(['reply' => $backupReply], 200);
        }

        // صياغة الـ System Context الكامل لـ Gemini باش يعرف أبعاد الـ PFE ديالك
        $systemInstruction = "Tu es 'WeddingBot', l'assistant IA intégré d'une plateforme web marocaine de mariage. "
                           . "Tu connais parfaitement le projet : il gère des Clients, des Prestataires (Salles, Traiteurs, Negafas qui publient des formules, gèrent leur calendrier de disponibilité) et un Admin (statistiques, validation). "
                           . "Les utilisateurs peuvent voir le Marketplace, consulter les calendriers et faire des demandes de Devis en ligne. "
                           . "Réponds obligatoirement EN FRANÇAIS, de manière chic, chaleureuse, structurée avec des tirets, et en faisant toujours le lien avec les fonctionnalités du site.";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(4)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $systemInstruction . "\n\nQuestion de l'utilisateur : " . $userMessage]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.6,
                    'maxOutputTokens' => 800,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? $backupReply;
                return response()->json(['reply' => $reply], 200);
            }

            // في حال وجود أي عائق في الـ API الخارجي، نمرر الجواب الشامل المخصص للمنصة فوراً
            return response()->json(['reply' => $backupReply], 200);

        } catch (\Exception $e) {
            return response()->json(['reply' => $backupReply], 200);
        }
    }
}