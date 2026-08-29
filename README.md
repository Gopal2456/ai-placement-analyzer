# AI Placement Analyzer

An AI-powered career assistant that helps candidates understand how well
their resume matches a job description, identify skill gaps, improve
their profile, prepare for interviews, and discover relevant job
opportunities.

## 🚀 Overview

The **AI Placement Analyzer** is an end-to-end career assistance
platform designed to make the job-search and interview-preparation
process more data-driven.

A user can upload a resume and provide a job description. The system
extracts relevant information, compares the candidate's skills with the
job requirements, calculates a match score, identifies missing skills,
provides improvement recommendations, and generates role-specific
interview questions.

For larger collections of jobs and career resources, the platform can
use **embeddings, MongoDB Atlas Vector Search, and RAG** to provide
semantic job matching and contextual AI analysis.

## ✨ Features

-   📄 Resume PDF upload and text extraction
-   💼 Job description input through text or document upload
-   🧠 Resume and job-description skill extraction
-   📊 Deterministic resume-to-job match scoring
-   🔍 Matched and missing skill identification
-   🤖 AI-powered skill-gap analysis and recommendations
-   🎯 Role-specific technical and behavioral interview questions
-   🔎 Semantic job search using embeddings and vector search
-   📚 RAG-based contextual analysis for larger job and resume
    collections
-   🔐 User authentication and protected dashboard
-   📈 Match scores and analytics through charts
-   👤 Profile and settings management

## 🧩 Main Modules

### Authentication

Handles registration, login, logout, session/JWT handling, and protected
routes.

### Resume Management

Allows users to upload PDF resumes, extract text, and store structured
resume information such as skills, experience, education, and projects.

### Job Management

Allows users to create or upload job descriptions and extract their
requirements.

### Placement Analyzer

Compares the candidate's resume capabilities against job requirements
and calculates a match score.

### Skill Gap Analyzer

Identifies missing skills and generates practical recommendations for
improvement.

### Interview Generator

Generates technical, behavioral, resume-based, and skill-gap interview
questions.

### Semantic Job Matcher

Uses embeddings and vector similarity to retrieve jobs that are
semantically relevant to a user's resume.

### RAG Analyzer

Retrieves relevant context before sending information to the LLM, making
contextual analysis more useful when working with larger collections of
jobs, resumes, interview resources, or other knowledge sources.

## 🏗️ Architecture

``` text
User
  ↓
Next.js UI
  ↓
API / Server Logic
  ↓
MongoDB Atlas / Vector Search
  ↓
AI / LLM Services
  ↓
Structured JSON
  ↓
Dashboard
```

For semantic job matching:

``` text
Resume
  ↓
Embedding
  ↓
MongoDB Atlas Vector Search
  ↓
Top Matching Jobs
  ↓
Ranking / Explanation
```

For RAG-based analysis:

``` text
Source Documents
  ↓
Embeddings
  ↓
MongoDB Atlas Vector Search
  ↓
Relevant Context
  ↓
LLM
  ↓
Structured Response
  ↓
Frontend
```

## 🛠️ Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js + TypeScript    Dashboard, forms,
                                                  protected pages and UI

  Styling                 Tailwind CSS            Responsive interface

  Database                MongoDB Atlas           Users, resumes, jobs
                                                  and analyses

  Vector Search           MongoDB Atlas Vector    Semantic similarity
                          Search                  search

  AI                      LLM API                 Analysis,
                                                  recommendations and
                                                  interview questions

  Embeddings              Embedding Model         Semantic representation

  Files                   PDF Parser / Upload     Resume and JD text
                          Handling                extraction

  Charts                  Recharts                Match scores and
                                                  analytics

  Authentication          JWT / Secure Session    User authentication

  Deployment              Vercel + MongoDB Atlas  Production hosting
  -----------------------------------------------------------------------

## 📊 AI Analysis Pipeline

The core analysis uses structured comparison before introducing RAG.

``` text
Resume PDF
    ↓
Text Extraction
    ↓
Structured Resume Data

Job Description
    ↓
Requirement Extraction
    ↓
Structured Job Data

Resume + Job
    ↓
Skill Comparison
    ↓
Match Score + Skill Gaps

Skill Gaps + Context
    ↓
LLM
    ↓
Recommendations + Interview Questions
```

The base match score should be calculated using deterministic logic
rather than allowing the LLM to invent the numeric score.

For example, if 8 out of 10 required skills match, the base score is
**80%**. The LLM can then explain the result and generate
recommendations.

## 🔌 API Structure

  Method   Endpoint                    Purpose
  -------- --------------------------- ----------------------------------------
  POST     `/api/auth/register`        Create account
  POST     `/api/auth/login`           Login
  GET      `/api/auth/me`              Get current user
  POST     `/api/resumes/upload`       Upload and process resume
  GET      `/api/resumes`              List user resumes
  POST     `/api/jobs`                 Create job description
  GET      `/api/jobs`                 List jobs
  POST     `/api/analyze`              Analyze resume against job description
  POST     `/api/interview/generate`   Generate interview questions
  POST     `/api/jobs/search`          Semantic job search

## 🖥️ UI Pages

-   Landing / Login
-   Dashboard
-   Resume Manager
-   Job Description Manager
-   New Analysis
-   Analysis Results
-   Skill Gap Details
-   Interview Practice
-   Recommended Jobs
-   Profile / Settings

## 🗃️ Core Data Models

### User

``` text
userId
name
email
passwordHash
createdAt
```

### Resume

``` text
resumeId
userId
fileName
rawText
skills[]
experience[]
education[]
projects[]
createdAt
```

### Job

``` text
jobId
userId
title
company
description
skills[]
embedding[]
createdAt
```

### Analysis

``` text
analysisId
userId
resumeId
jobId
matchScore
matchedSkills[]
missingSkills[]
strengths[]
weaknesses[]
recommendations[]
createdAt
```

## 🔎 Semantic Job Matching

When multiple job descriptions are stored, each job can be converted
into an embedding and stored with the job document.

The user's resume is also converted into an embedding and used as the
semantic search query.

This enables a **"Find Jobs For Me"** experience that can return
relevant jobs and explain why each job matches the candidate.

## 📚 RAG

RAG is intended for situations where the application contains a larger
collection of jobs, resumes, interview resources, or other knowledge
sources.

The pipeline is:

1.  Convert source text into embeddings.
2.  Store embeddings in MongoDB Atlas Vector Search.
3.  Retrieve the most relevant context.
4.  Send the retrieved context to the LLM.
5.  Return structured output to the frontend.

## 🗺️ Development Roadmap

-   [x] Project architecture and planning
-   [ ] Next.js, TypeScript, Tailwind CSS and MongoDB setup
-   [ ] Authentication and protected dashboard
-   [ ] Resume PDF upload and extraction
-   [ ] Job description input and requirement extraction
-   [ ] Deterministic match scoring
-   [ ] Matched/missing skill analysis
-   [ ] AI recommendations
-   [ ] Embeddings and MongoDB Vector Search
-   [ ] Semantic job matching
-   [ ] RAG pipeline
-   [ ] Interview question generator
-   [ ] UI polish and analytics
-   [ ] Error handling and security improvements
-   [ ] Docker and deployment

## 💡 Future Enhancements

-   **Find Jobs For Me** --- Retrieve and rank relevant jobs from a
    large job-description collection.
-   **Explainable Match Score** --- Show which requirements contributed
    to the score.
-   **Interview Practice Mode** --- Allow users to answer questions and
    receive AI feedback.
-   **Resume Improvement Mode** --- Suggest stronger wording without
    fabricating experience.
-   **Analytics Dashboard** --- Track analyzed jobs, match scores, and
    recurring skill gaps.
-   **Personal Learning Roadmap** --- Generate a learning roadmap based
    on recurring skill gaps.

## 🔐 Security

The project follows several security practices:

-   Keep AI API keys on the server and never expose them in browser
    code.
-   Validate uploaded file types and sizes.
-   Sanitize and validate user input.
-   Protect private resume and analysis endpoints.
-   Avoid storing unnecessary personal information.
-   Use structured JSON schemas for LLM responses.
-   Handle AI failures, timeouts, and malformed output.
-   Add rate limiting to expensive AI endpoints.
-   Store secrets in environment variables.

## 🎯 MVP

The first deployable version focuses on:

1.  Authentication
2.  Resume PDF upload
3.  Job-description input
4.  Resume/JD comparison
5.  Match score
6.  Skill-gap identification
7.  AI recommendations
8.  Interview-question generation

After the core analyzer is stable, embeddings, Vector Search, and RAG
can be introduced as advanced features.

## 📌 Project Status

This project is being developed as a portfolio-level AI career platform,
with the core analyzer serving as the foundation for advanced semantic
search and RAG capabilities.

## 📄 Documentation

The project's technical documentation covers the architecture, modules,
data models, AI pipeline, API structure, UI pages, development roadmap,
portfolio enhancements, and security practices.

------------------------------------------------------------------------

⭐ If you find this project useful, consider giving the repository a
star.
