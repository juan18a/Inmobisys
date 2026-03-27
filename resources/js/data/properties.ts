export interface Property {
    title: string;
    location: string;
    price: string;
    sqft: string;
    beds: number;
    baths: number;
    img: string;
}

export const properties: Property[] = [
    {
        title: "Velvet Horizon",
        location: "Santorini, Greece",
        price: "$5,100,000",
        sqft: "3,800",
        beds: 4,
        baths: 4,
        img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    },
    {
        title: "Marble Crest",
        location: "Italy",
        price: "$6,400,000",
        sqft: "5,200",
        beds: 5,
        baths: 6,
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    }
];