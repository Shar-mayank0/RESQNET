# DisasterSync - Real-Time Disaster Information Aggregation

============================================================

**Hackathon Project**
**Team**: Aditya Kumar Singh, Mayank Sharma, Harsh Kumar, Bhumika Khatri
**Institution**: SKIT, Jaipur
**Date**: March 28, 2025

## Overview

DisasterSync is a software solution designed to automatically gather and categorize disaster-related data from social media, news portals, and open sources in real-time. Using advanced AI algorithms (NLP, image analysis, and predictive modeling), it filters relevant insights and presents them on an interactive dashboard for disaster response agencies. The system enhances situational awareness, streamlines emergency response efforts, and improves decision-making to save lives.

This project was developed for a hackathon with the problem statement: _Real-Time Disaster Information Aggregation_.

## Features

- **Real-Time Data Collection**: Aggregates data from Twitter/X, IMD, news RSS feeds, and geospatial sources.
- **AI-Driven Insights**:
  - NLP for text analysis (e.g., extracting locations, disaster types from tweets).
  - Google Vision API for image analysis (e.g., assessing flood severity).
  - Predictive modeling for disaster risk zones.
- **Interactive Dashboard**: Built with Next.js and Mapbox, displaying live disaster updates and geospatial visualizations.
- **Unique Additions**:
  - Voice alerts for critical updates.
  - Geospatial risk assessment with evacuation route suggestions.
- **Scalable Backend**: Powered by FastAPI and PostgreSQL/SQLite.

## Tech Stack

### Frontend

- Next.js (React framework)
- Mapbox GL JS (interactive maps)
- TailwindCSS (styling)
- D3.js/Recharts (data visualization)

### Backend

- Python FastAPI (API framework)
- PostgreSQL/SQLite (database)
- WebSockets (real-time updates)

### AI/ML

- spaCy/Transformers (NLP for text processing)
- Google Vision API (image analysis)
- TensorFlow (predictive modeling)

### Data Sources

- Twitter/X API (social media)
- IMD API/RSS (weather data)
- News RSS feeds (e.g., BBC, Times of India)
- Bhuvan GIS/OpenStreetMap (geospatial data)

## Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- Google Cloud account (for Vision API)
- Twitter/X Developer account (for API access)
- PostgreSQL (optional; SQLite works for prototype)

### Backend Setup

1. Navigate to the backend folder:
