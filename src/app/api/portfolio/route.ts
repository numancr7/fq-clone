
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Portfolio from '@/models/Portfolio';

// This is the default data structure returned when no database is connected.
const defaultData = {
    personal: {
        name: "Your Name",
        title: "Web Developer",
        image: "https://placehold.co/228x128.png",
        contacts: [
            { label: 'EMAIL', text: 'your.email@example.com', href: 'mailto:your.email@example.com' },
            { label: 'PHONE', text: '+1 234 567 890', href: 'tel:+1234567890' },
            { label: 'LOCATION', text: 'City, Country' },
        ],
        socials: [
            { href: 'https://github.com' },
            { href: 'https://linkedin.com' },
            { href: 'https://medium.com' },
        ],
        resumeUrl: "#"
    },
    about: {
        aboutText: "A brief bio about yourself. You can edit this in the admin dashboard once you connect a database.",
        whatIDo: [
            { title: "Web Development", description: "Modern and mobile-ready website that will help you reach all of your marketing." },
            { title: "Data Analysis", description: "Analysis of large and complex data sets to support business decision-making." },
        ]
    },
    resume: {
        education: [
            { institution: "University of Example", degree: "M.Sc. in Computer Science", details: ["Relevant coursework..."] }
        ],
        certifications: [
            { name: "Certified Next.js Developer", issuer: "Vercel" }
        ],
        skills: [
            { name: 'Data-First Mindset: Proficient In Statistical Analysis & Hypothesis Testing', proficiency: 80 },
            { name: 'Programming: Proficiency In Python And SQL', proficiency: 70 },
            { name: 'Data Visualization: Exposure To Tools Such As Tableau, Power BI, Matplotlib, MS Excel', proficiency: 90 },
            { name: 'Database Management: Familiarity With Database System', proficiency: 60 }
        ]
    },
    portfolio: {
        tags: ["All", "Tableau", "Power BI", "MS Excel", "Python"],
        projects: [
            { title: "Sample Project", description: "A sample project description.", image: "https://placehold.co/600x400.png", tags: ["MS Excel"], githubUrl: "#", dataAiHint: "dashboard analytics" }
        ]
    },
    blog: {
        posts: [
             { title: "My First Blog Post", date: "2024-01-01", image: "https://placehold.co/600x400.png", description: "This is a summary of the blog post.", url: "#", content: "Full content of the blog post.", dataAiHint: "blog post" }
        ]
    }
};

// This function ensures there's always a default portfolio document to work with.
async function getOrCreatePortfolio() {
    await dbConnect();
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
        // If no document exists, create one with default empty values.
        portfolio = new Portfolio({
            personal: {
                name: "Your Name",
                title: "Your Title",
                image: "https://placehold.co/228x128.png",
                contacts: [],
                socials: [],
                resumeUrl: ""
            },
            about: {
                aboutText: "",
                whatIDo: []
            },
            resume: {
                education: [],
                certifications: [],
                skills: []
            },
            portfolio: {
                tags: [],
                projects: []
            },
            blog: {
                posts: []
            }
        });
        await portfolio.save();
    }
    return portfolio;
}


export async function GET() {
    // If no MONGODB_URI is set, return the default mock data.
    // This allows the app to run without a database connection for development or preview.
    if (!process.env.MONGODB_URI) {
        console.log("MONGODB_URI not found, returning default data. Please set it in your .env file.");
        return NextResponse.json(defaultData);
    }
    
    try {
        const portfolioData = await getOrCreatePortfolio();
        return NextResponse.json(portfolioData);
    } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
        return NextResponse.json({ message: "Failed to fetch data", error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // If no MONGODB_URI is set, just return a success message for the mock save.
    if (!process.env.MONGODB_URI) {
        console.log("MONGODB_URI not found, POST request is mocked. Please set it in your .env file.");
        const data = await request.json();
        return NextResponse.json({ message: 'Data saved successfully (mocked)', data }, { status: 200 });
    }

    try {
        await dbConnect();
        const data = await request.json();
        
        // Use findOneAndUpdate with upsert:true to create the document if it doesn't exist.
        const updatedPortfolio = await Portfolio.findOneAndUpdate({}, data, {
            new: true, // Return the modified document
            upsert: true, // Create a new document if one doesn't exist
            runValidators: true, // Ensure the update follows the schema
        });
        
        return NextResponse.json({ message: 'Data saved successfully', data: updatedPortfolio }, { status: 200 });
    } catch (error) {
        console.error("Failed to save portfolio data:", error);
        return NextResponse.json({ message: "Failed to save data", error: error.message }, { status: 500 });
    }
}
