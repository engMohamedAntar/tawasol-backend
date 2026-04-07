//profileService.js
const Profile = require("../models/Profile");
const User = require("../models/User");
const normalizeUrl = require("normalize-url");
const upload = require("../utils/upload");
const Post = require("../models/Post");

exports.createProfile = async (req, res) => {
  const {
    skills,
    website,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
    github,
    ...rest
  } = req.body;

  let profile = {
    user: req.user.id,
    skills: Array.isArray(skills)
      ? skills
      : skills.split(",").map((skill) => skill.trim()),
    website: website ? normalizeUrl(website, { forceHttps: true }) : "",
    ...rest,
  };

  //normalize the rest of social media urls
  let socialProfiles = {
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
    github,
  };
  for (let key in socialProfiles) {
    const val = socialProfiles[key];
    if (val && val !== "")
      socialProfiles[key] = normalizeUrl(val, { forceHttps: true });
  }
  profile.social = socialProfiles;

  try {
    const newProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      profile,
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    );
    res.status(201).json({ profile: newProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    "user",
    ["name"],
  );
  if (!profile) return res.status(404).json({ error: "Profile not found" });

  res.status(200).json({ profile });
};

exports.getProfiles = async (req, res) => {
  const profiles = await Profile.find().populate("user", ["name"]);
  res.status(200).json({ profiles });
};

exports.getUserProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.user_id }).populate(
    "user",
    ["name"],
  );
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.status(200).json({ profile });
};

exports.deleteProfile = async (req, res) => {
  await Promise.all([
    User.findByIdAndDelete(req.user.id),
    Post.deleteMany({ user: req.user.id }),
    Profile.findOneAndDelete({ user: req.user.id }),
  ]);

  res.status(200).json("User info deleted successfully");
};

exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).json(err);

    return res.status(200).send(req.file);
  });
};

exports.createExperience = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  profile.experience.unshift(req.body);
  await profile.save();
  res.status(201).json(profile);
};

exports.createEducation = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  profile.education.unshift(req.body);
  await profile.save();
  res.status(201).json(profile);
};

exports.deleteExperience = async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { experience: { _id: req.params.exp_id } } },
    { returnDocument: "after" },
  );
  res.status(200).json(profile);
};

exports.deleteEducation = async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { education: { _id: req.params.edu_id } } },
    { returnDocument: "after" },
  );
  res.status(200).json(profile);
};
