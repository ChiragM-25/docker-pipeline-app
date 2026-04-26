pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                echo "Code pulled from GitHub"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pipeline-app .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker rm -f pipeline-container || true
                docker run -d -p 3003:3000 --name pipeline-container pipeline-app
                '''
            }
        }

    }
}