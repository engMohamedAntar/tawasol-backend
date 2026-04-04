//profileService.js
const Profile = require("../models/Profile");
const normalizeUrl = require("normalize-url");
exports.createProfile = async (req, res) => {
  /*
    {
        "company": “ARAMEX”,
        “status”: “Junior Developer”,
        “skills”: [”HTML, CSS, PHP, JAVASCRIPT”],
        “website”: ”https://www.mywebsite.com“,
        “location”:”Dubai”,
        “bio”:”I am a software engineer and studied in the Arabic university”,
        “github”:””,
        “twitter”:””,
        “youtube”:””
    }
*/
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
    skills: Array.isArray(skills) ? skills : skills.split(",").map((skill) => skill.trim()),
    website: website ? normalizeUrl(website, { forceHttps: true }) : "", 
    ...rest
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
