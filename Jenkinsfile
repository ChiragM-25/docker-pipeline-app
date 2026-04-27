pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "pipeline-app"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Pre-Cleanup (Global)') {
            steps {
                sh '''
                echo "Cleaning old standalone containers (if any)..."
                docker rm -f pipeline-container || true

                echo "Bringing down any existing compose stack..."
                docker compose down --remove-orphans || true
                '''
            }
        }

        stage('Build & Deploy (Compose)') {
            steps {
                sh '''
                docker compose up --build -d
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                echo "Running containers:"
                docker compose ps

                echo "Health check (app):"
                sleep 5
                curl -s http://localhost:3004 || true
                '''
            }
        }
    }

    post {
        failure {
            sh '''
            echo "Pipeline failed. Collecting logs..."
            docker compose logs --no-color || true
            '''
        }
    }
}