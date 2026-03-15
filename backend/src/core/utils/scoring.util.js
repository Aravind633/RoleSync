export const calculateMatchScore = (candidateProfile, job) => {
  let totalScore = 0;
  const details = { skillsMatch: 0, experienceMatch: 0, locationMatch: 0 };
  if (job.skills && job.skills.length > 0 && candidateProfile.skills) {
    const candidateSkills = candidateProfile.skills.map(s => s.toLowerCase().trim());
    const jobSkills = job.skills.map(s => s.toLowerCase().trim());
    

    const matchedSkills = jobSkills.filter(skill => candidateSkills.includes(skill));
    
   
    details.skillsMatch = Math.round((matchedSkills.length / jobSkills.length) * 70);
    totalScore += details.skillsMatch;
  }

  const experienceMap = { 'Entry': 0, 'Mid': 2, 'Senior': 5, 'Director': 8, 'Executive': 12 };
  const requiredYears = experienceMap[job.experienceLevel] || 0;
  const candidateYears = candidateProfile.experienceYears || 0;

  if (candidateYears >= requiredYears) {
    details.experienceMatch = 15; 
  } else if (candidateYears >= requiredYears - 2) {
    details.experienceMatch = 7;  
  }
  totalScore += details.experienceMatch;

  const jobLoc = (job.location || '').toLowerCase().trim();
  const candLoc = (candidateProfile.location || '').toLowerCase().trim();

  if (jobLoc.includes('remote') || candLoc === jobLoc) {
    details.locationMatch = 15; 
  }
  totalScore += details.locationMatch;

  return {
    totalScore,
    details
  };
};