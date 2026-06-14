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

  // ─── Study Plan Generator (Sprint 8C) ──────────────────────────────────────

  /**
   * @param {string} goal       - e.g. "Learn React"
   * @param {number} duration   - number of days
   * @param {object} [context]  - { department, currentGoals }
   */
  studyPlan(goal, duration = 30, context = {}) {
    const weeks = Math.max(1, Math.ceil(duration / 7))
    const contextBlock = context.currentGoals || context.department
      ? `\nLearner context:\n- Department: ${context.department ?? 'Not specified'}\n- Current goals: ${context.currentGoals ?? 'Not specified'}`
      : ''

    return `You are a learning coach for students.

Generate a structured ${duration}-day study plan (${weeks} weeks) for the following goal: "${goal}"${contextBlock}

Each week must include:
- week number
- focus topic
- list of specific tasks/topics to cover
- a milestone to achieve by end of week

Also include 2-3 recommended learning resources.

Respond ONLY with valid JSON in this exact format:
{
  "goal": "${goal}",
  "duration": ${duration},
  "weeks": [
    {
      "week": 1,
      "focus": "<main topic>",
      "topics": ["<topic1>", "<topic2>", "<topic3>"],
      "milestone": "<what learner can do by end of week>"
    }
  ],
  "resources": ["<resource1>", "<resource2>"]
}`.trim()
  },

  // ─── Goal Analyser (Sprint 8D) ─────────────────────────────────────────────

  /**
   * @param {string} goal     - learner's free-text goal
   * @param {object} [context] - { department, currentGoals }
   */
  goalAnalysis(goal, context = {}) {
    const contextBlock = context.currentGoals || context.department
      ? `\nLearner context:\n- Department: ${context.department ?? 'Not specified'}\n- Current goals: ${context.currentGoals ?? 'Not specified'}`
      : ''

    return `You are an educational advisor and career coach.

A student has the following career/learning goal: "${goal}"${contextBlock}

Analyze this goal and provide a comprehensive breakdown.

Respond ONLY with valid JSON in this exact format:
{
  "goal": "${goal}",
  "requiredSkills": ["<skill1>", "<skill2>", "<skill3>"],
  "roadmap": ["<step1>", "<step2>", "<step3>", "<step4>"],
  "recommendedTechnologies": ["<tech1>", "<tech2>", "<tech3>"],
  "careerSuggestions": ["<suggestion1>", "<suggestion2>"],
  "mentorFocusAreas": ["<area1>", "<area2>", "<area3>"]
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
