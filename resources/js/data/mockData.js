export const villesMaroc = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fès", "Safi"];

export const traiteurs = [
    {
        id: 1,
        nom: "Traiteur Al Akhawayn",
        ville: "Casablanca",
        note: 4.8,
        nbAvis: 120,
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
        description: "Spécialiste de la cuisine marocaine traditionnelle et moderne.",
        typeCuisine: "Marocaine",
        experience: 15,
        formules: [
            { id: 101, nom: "Menu Prestige", prixParPersonne: 350 },
            { id: 102, nom: "Menu Royal", prixParPersonne: 500 }
        ],
        specialites: ["Pastilla", "Mechoui", "Couscous"]
    },
    {
        id: 2,
        nom: "Delices de Marrakech",
        ville: "Marrakech",
        note: 4.9,
        nbAvis: 85,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        description: "Une expérience culinaire unique au cœur de la ville ocre.",
        typeCuisine: "Internationale",
        experience: 10,
        formules: [
            { id: 201, nom: "Buffet Gourmand", prixParPersonne: 250 },
            { id: 202, nom: "Dîner de Gala", prixParPersonne: 450 }
        ],
        specialites: ["Tanjia", "Cuisine Fusion"]
    }
];