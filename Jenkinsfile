pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "pipeline-app"
    }

    stages {

        stage('Clone Code') {
            steps {
                echo "Pulling latest code..."
            }
        }

        stage('Stop Existing Containers') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Build & Start Full App') {
            steps {
                sh 'docker compose up --build -d'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker compose ps'
            }
        }
    }
}