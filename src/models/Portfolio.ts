
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    label: String,
    text: String,
    href: String,
    // Icon mapping will be handled on the frontend
});

const SocialSchema = new mongoose.Schema({
    href: String,
    // Icon mapping will be handled on the frontend
});

const ServiceSchema = new mongoose.Schema({
    title: String,
    description: String,
    iconUrl: String,
});

const EducationSchema = new mongoose.Schema({
    institution: String,
    degree: String,
    details: [String],
});

const CertificationSchema = new mongoose.Schema({
    name: String,
    issuer: String,
});

const SkillSchema = new mongoose.Schema({
    name: String,
    proficiency: Number,
});

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    tags: [String],
    githubUrl: String,
    dataAiHint: String,
});

const PostSchema = new mongoose.Schema({
    title: String,
    date: String,
    image: String,
    description: String,
    url: String,
    content: String,
    dataAiHint: String,
});


const PortfolioSchema = new mongoose.Schema({
    personal: {
        name: String,
        title: String,
        image: String,
        contacts: [ContactSchema],
        socials: [SocialSchema],
        resumeUrl: String,
    },
    about: {
        aboutText: String,
        whatIDo: [ServiceSchema],
    },
    resume: {
        education: [EducationSchema],
        certifications: [CertificationSchema],
        skills: [SkillSchema],
    },
    portfolio: {
        tags: [String],
        projects: [ProjectSchema],
    },
    blog: {
        posts: [PostSchema],
    }
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
