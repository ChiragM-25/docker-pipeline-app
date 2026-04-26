pipeline {
    agent any

    environment {
        IMAGE_NAME = "pipeline-app"
        CONTAINER_NAME = "pipeline-container"
        PORT = "3003"
    }

    stages {

        stage('Clone Code') {
            steps {
                echo "Pulling latest code..."
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                docker run -d -p $PORT:3000 \
                --name $CONTAINER_NAME \
                $IMAGE_NAME:latest
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }
}