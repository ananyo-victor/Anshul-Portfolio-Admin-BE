import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
  id: { type: Number},
  name: { type: String}
});

const skillSchema = new mongoose.Schema({
  id: { type: Number},
  category: { type: String},
  tools: [toolSchema]
});

const userSchema = new mongoose.Schema({
  id: { type: Number},
  name: { type: String},
  resume: { type: String},
  github: { type: String},
  photo: { type: String}
});

const projectSchema = new mongoose.Schema({
  id: { type: Number},
  image: { type: String},
  name: { type: String},
  description: { type: String},
  link: { type: String}
});

const experienceSkillSchema = new mongoose.Schema({
  id: { type: Number},
  name: { type: String}
});

const experienceSchema = new mongoose.Schema({
  id: { type: Number},
  logo: { type: String},
  role: { type: String},
  company: { type: String},
  start: { type: Date},
  end: { type: Date},
  description: { type: String},
  skills: [experienceSkillSchema]
});

const educationSchema = new mongoose.Schema({
  id: { type: Number},
  institute: { type: String},
  start: { type: Date},
  end: { type: Date},
  grade: { type: String},
  description: { type: String}
});

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
  users: [userSchema],
  projects: [projectSchema],
  experiences: [experienceSchema],
  educations: [educationSchema],
  skills: [skillSchema]
});

const PortfolioModel = mongoose.model("Portfolio", portfolioSchema);

export default PortfolioModel;
