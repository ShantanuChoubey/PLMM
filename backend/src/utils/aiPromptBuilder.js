/**
 * aiPromptBuilder.js
 * Centralised prompt factory for all PLMM AI features.
 * Future AI modules import from here — prompts are never hardcoded in services.
 */

// ─── Generic ──────────────────────────────────────────────────────────────────

export const promptBuilder = {
  /**
   * Wrap any raw user prompt with safety + format instructions.
   */
  general(userPrompt) {
    return `You are an AI assistant for PLMM (Peer Learning & Mentor Matching Platform), an educational platform that connects students with mentors.

Answer the following clearly and concisely. Stay on-topic with education and learning.

${userPrompt}`.trim()
  },

  // ─── Mentor Recommendation (Sprint 8B) ─────────────────────────────────────

  /**
   * @param {object} learnerProfile  - { goals, skills, department, year }
   * @param {Array}  mentors         - array of mentor profiles
   */
  mentorRecommendation(learnerProfile, mentors) {
    return `You are a mentor recommendation system for an educational platform.

Learner Profile:
- Department: ${learnerProfile.department ?? 'Not specified'}
- Year: ${learnerProfile.year ?? 'Not specified'}
- Goals: ${learnerProfile.goals ?? 'Not specified'}

Available Mentors:
${mentors.map((m, i) => `${i + 1}. Name: ${m.user?.name}, Skills: ${m.skills?.map(s => s.skill.name).join(', ')}, Rating: ${m.rating}, Experience: ${m.experience}`).join('\n')}

Rank the top 3 mentors based on skill match, experience, and rating.
Respond ONLY with valid JSON in this exact format:
{
  "recommendations": [
    {
      "mentorId": "<id>",
      "score": <1-100>,
      "reason": "<brief explanation>"
    }
  ]
}`.trim()
  },

  // ─── Study Plan Generator (Sprint 8B) ──────────────────────────────────────

  /**
   * @param {string} goal  - e.g. "Learn React in 30 days"
   */
  studyPlan(goal) {
    return `You are a learning coach for students.

Generate a structured study plan for the following goal: "${goal}"

Respond ONLY with valid JSON in this exact format:
{
  "goal": "${goal}",
  "duration": "<e.g. 30 days>",
  "weeks": [
    {
      "week": 1,
      "focus": "<topic>",
      "tasks": ["<task1>", "<task2>"]
    }
  ],
  "resources": ["<resource1>", "<resource2>"]
}`.trim()
  },

  // ─── Goal Analyser (Sprint 8B) ─────────────────────────────────────────────

  /**
   * @param {string} goal - learner's free-text goal
   */
  goalAnalysis(goal) {
    return `You are an educational advisor.

A student has the following learning goal: "${goal}"

Extract the key skills they need to learn.
Respond ONLY with valid JSON in this exact format:
{
  "goal": "${goal}",
  "requiredSkills": ["<skill1>", "<skill2>"],
  "suggestedPath": "<brief learning path>",
  "estimatedDuration": "<e.g. 3 months>"
}`.trim()
  },

  // ─── Group Recommendation (Sprint 8B) ──────────────────────────────────────

  /**
   * @param {object} learnerProfile
   * @param {Array}  groups
   */
  groupRecommendation(learnerProfile, groups) {
    return `You are a study group recommendation system.

Learner interests/goals: ${learnerProfile.goals ?? 'General learning'}

Available groups:
${groups.map((g, i) => `${i + 1}. Name: ${g.name}, Category: ${g.category}, Members: ${g._count?.members ?? 0}`).join('\n')}

Recommend the top 3 most relevant groups.
Respond ONLY with valid JSON in this exact format:
{
  "recommendations": [
    {
      "groupId": "<id>",
      "score": <1-100>,
      "reason": "<brief explanation>"
    }
  ]
}`.trim()
  },
}
