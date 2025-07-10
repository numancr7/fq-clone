
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Portfolio from '@/models/Portfolio';
import mongoose from 'mongoose';

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
            { _id: '1', title: "Sample Project", description: "A sample project description.", image: "https://placehold.co/600x400.png", tags: ["MS Excel"], githubUrl: "#", dataAiHint: "dashboard analytics" }
        ]
    },
    blog: {
        posts: [
             { _id: '1', title: "My First Blog Post", date: "2024-01-01", image: "https://placehold.co/600x400.png", description: "This is a summary of the blog post.", url: "#", content: "Full content of the blog post.", dataAiHint: "blog post" }
        ]
    }
};

async function getOrCreatePortfolio() {
    await dbConnect();
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
        portfolio = new Portfolio({
            personal: { name: "Your Name", title: "Your Title" },
            about: {},
            resume: {},
            portfolio: {},
            blog: {},
        });
        await portfolio.save();
    }
    return portfolio;
}

// Exported function for direct server-side use
export async function getPortfolioData() {
    if (!process.env.MONGODB_URI) {
        console.log("MONGODB_URI not found, returning default data.");
        return defaultData;
    }
    try {
        const portfolioData = await getOrCreatePortfolio();
        return portfolioData;
    } catch (error) {
        console.error("Failed to fetch portfolio data directly:", error);
        // Fallback to default data in case of an error during direct fetch
        return defaultData;
    }
}


export async function GET(request: Request) {
    if (!process.env.MONGODB_URI) {
        console.log("MONGODB_URI not found, returning default data.");
        return NextResponse.json(defaultData);
    }
    
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');
        const projectId = searchParams.get('projectId');
        const section = searchParams.get('section');

        const portfolioData = await getOrCreatePortfolio();
        
        if (section === 'projects') {
             return NextResponse.json({ projects: portfolioData.portfolio.projects });
        }

        if (postId) {
            const post = portfolioData.blog.posts.id(postId);
            if (!post) {
                return NextResponse.json({ message: "Post not found" }, { status: 404 });
            }
            return NextResponse.json(post);
        }

        if (projectId) {
            const project = portfolioData.portfolio.projects.id(projectId);
            if (!project) {
                return NextResponse.json({ message: "Project not found" }, { status: 404 });
            }
            return NextResponse.json(project);
        }

        return NextResponse.json(portfolioData);
    } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: "Failed to fetch data", error: errorMessage }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!process.env.MONGODB_URI) {
        console.log("MONGODB_URI not found, POST request is mocked.");
        const data = await request.json();
        return NextResponse.json({ message: 'Data saved successfully (mocked)', data }, { status: 200 });
    }

    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');
        const data = await request.json();
        
        // Handle adding a new project
        if (section === 'projects') {
            const portfolio = await getOrCreatePortfolio();
            portfolio.portfolio.projects.push(data);
            await portfolio.save();
            const newProject = portfolio.portfolio.projects[portfolio.portfolio.projects.length - 1];
            return NextResponse.json({ message: 'Project added successfully', project: newProject }, { status: 201 });
        }
        
        // Handle general data save
        const updatedPortfolio = await Portfolio.findOneAndUpdate({}, data, {
            new: true,
            upsert: true,
            runValidators: true,
        });
        
        return NextResponse.json({ message: 'Data saved successfully', data: updatedPortfolio }, { status: 200 });
    } catch (error) {
        console.error("Failed to save portfolio data:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: "Failed to save data", error: errorMessage }, { status: 500 });
    }
}


export async function PUT(request: Request) {
    if (!process.env.MONGODB_URI) {
        return NextResponse.json({ message: "Cannot add post without a database connection." }, { status: 503 });
    }
    try {
        await dbConnect();
        const postData = await request.json();
        const portfolio = await getOrCreatePortfolio();
        
        portfolio.blog.posts.push(postData);
        await portfolio.save();

        const newPost = portfolio.blog.posts[portfolio.blog.posts.length - 1];
        
        return NextResponse.json({ message: 'Blog post added successfully', post: newPost }, { status: 201 });
    } catch (error) {
        console.error("Failed to add blog post:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: "Failed to add blog post", error: errorMessage }, { status: 500 });
    }
}


export async function PATCH(request: Request) {
     if (!process.env.MONGODB_URI) {
        return NextResponse.json({ message: "Cannot modify post without a database connection." }, { status: 503 });
    }
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');
        const projectId = searchParams.get('projectId');
        
        const portfolio = await getOrCreatePortfolio();
        const postData = await request.json();

        if (postId) {
            const postIndex = portfolio.blog.posts.findIndex((p: any) => p._id.toString() === postId);
            if (postIndex === -1) return NextResponse.json({ message: "Post not found" }, { status: 404 });
            
            Object.assign(portfolio.blog.posts[postIndex], postData);
            await portfolio.save();
            return NextResponse.json({ message: 'Post updated successfully', post: portfolio.blog.posts[postIndex] }, { status: 200 });
        }

        if (projectId) {
            const projectIndex = portfolio.portfolio.projects.findIndex((p: any) => p._id.toString() === projectId);
            if (projectIndex === -1) return NextResponse.json({ message: "Project not found" }, { status: 404 });

            Object.assign(portfolio.portfolio.projects[projectIndex], postData);
            await portfolio.save();
            return NextResponse.json({ message: 'Project updated successfully', project: portfolio.portfolio.projects[projectIndex] }, { status: 200 });
        }
        
        return NextResponse.json({ message: "ID is required for update" }, { status: 400 });

    } catch (error) {
        console.error("Failed to update item:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: "Failed to update item", error: errorMessage }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    if (!process.env.MONGODB_URI) {
        return NextResponse.json({ message: "Cannot delete without a database connection." }, { status: 503 });
    }
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');
        const projectId = searchParams.get('projectId');

        if (!postId && !projectId) {
            return NextResponse.json({ message: "ID is required for deletion" }, { status: 400 });
        }

        const portfolio = await getOrCreatePortfolio();
        let modified = false;

        if (postId) {
             const post = portfolio.blog.posts.id(postId);
             if (post) {
                post.remove();
                modified = true;
             }
        } else if (projectId) {
            const project = portfolio.portfolio.projects.id(projectId);
             if (project) {
                project.remove();
                modified = true;
             }
        }
        
        if (modified) {
            await portfolio.save();
            return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Item not found or already deleted" }, { status: 404 });
        }
        
    } catch (error) {
        console.error("Failed to delete item:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: "Failed to delete item", error: errorMessage }, { status: 500 });
    }
}
