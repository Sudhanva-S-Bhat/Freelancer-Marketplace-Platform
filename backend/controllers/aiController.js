const Project = require('../models/Project');
const FreelancerProfile = require('../models/FreelancerProfile');

async function getProjectMatches(req, res) {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const requiredSkills = project.requiredSkills.map(s => s.toLowerCase().trim());
    const category = project.category ? project.category.toLowerCase().trim() : '';

    // Fetch all completed freelancer profiles and populate user credentials
    const freelancers = await FreelancerProfile.find()
      .populate('user', 'fullName username email isVerified')
      .lean();

    const matches = freelancers
      .map(profile => {
        if (!profile.user) return null;

        // Calculate skill overlap
        const freelancerSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
        const matchingSkills = requiredSkills.filter(skill => freelancerSkills.includes(skill));
        
        let score = 0;
        
        // 1. Skill intersection score (up to 60%)
        if (requiredSkills.length > 0) {
          score += (matchingSkills.length / requiredSkills.length) * 60;
        }

        // 2. Category matching (up to 20%)
        if (category && profile.category && profile.category.toLowerCase().trim() === category) {
          score += 20;
        }

        // 3. Verified Pro Badge boost (up to 10%)
        if (profile.user.isVerified) {
          score += 10;
        }

        // 4. Experience Title Match (up to 10%)
        const titleMatch = requiredSkills.some(skill => 
          profile.professionalTitle && profile.professionalTitle.toLowerCase().includes(skill)
        );
        if (titleMatch) {
          score += 10;
        }

        // Round score
        const matchPercentage = Math.min(100, Math.round(score));

        return {
          freelancerId: profile.user._id,
          fullName: profile.user.fullName,
          username: profile.user.username,
          professionalTitle: profile.professionalTitle || 'Professional Freelancer',
          profilePicture: profile.profilePicture || '',
          hourlyRate: profile.hourlyRate || 0,
          skills: profile.skills || [],
          matchingSkills,
          matchPercentage
        };
      })
      .filter(Boolean)
      .filter(m => m.matchPercentage > 10) // Only display matches with > 10% relevance
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5); // Return top 5

    return res.json({ success: true, matches });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'AI matching failed', error: err.message });
  }
}

module.exports = {
  getProjectMatches
};
