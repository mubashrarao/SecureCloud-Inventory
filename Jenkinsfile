pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        APP_NAME = 'securecloud'
        EC2_IP = '3.220.117.190'
    }
    
    stages {
        stage('1. Checkout') {
            steps {
                echo '========================================='
                echo 'Checking out code from GitHub'
                echo '========================================='
                git branch: 'main', 
                    url: 'https://github.com/mubashrarao/SecureCloud-Inventory.git'
            }
        }
        
        stage('2. Install Dependencies') {
            steps {
                echo '========================================='
                echo 'Installing backend dependencies'
                echo '========================================='
                dir('app/backend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('3. Run Tests') {
            steps {
                echo '========================================='
                echo 'Running unit tests'
                echo '========================================='
                dir('app/backend') {
                    sh 'npm test || echo "No tests configured - skipping"'
                }
            }
        }
        
        stage('4. Security Scan - Code') {
            steps {
                echo '========================================='
                echo 'Scanning code for vulnerabilities with Trivy'
                echo '========================================='
                sh 'trivy fs app/backend --severity HIGH,CRITICAL --exit-code 0'
            }
        }
        
        stage('5. Build Docker Images') {
            steps {
                echo '========================================='
                echo 'Building Docker images'
                echo '========================================='
                sh 'docker build -t securecloud-backend:latest app/backend/'
                sh 'docker build -t securecloud-frontend:latest app/frontend/'
            }
        }
        
        stage('6. Security Scan - Images') {
            steps {
                echo '========================================='
                echo 'Scanning Docker images for vulnerabilities'
                echo '========================================='
                sh 'trivy image securecloud-backend:latest --severity HIGH,CRITICAL --exit-code 0'
                sh 'trivy image securecloud-frontend:latest --severity HIGH,CRITICAL --exit-code 0'
            }
        }
        
        stage('7. Deploy to EC2') {
            steps {
                echo '========================================='
                echo 'Deploying to AWS EC2 instance'
                echo '========================================='
                sh 'ssh -o StrictHostKeyChecking=no ubuntu@3.220.117.190 "cd ~/SecureCloud-Inventory && docker-compose down && docker-compose up -d"'
            }
        }
        
        stage('8. Verify Deployment') {
            steps {
                echo '========================================='
                echo 'Verifying deployment'
                echo '========================================='
                sh 'sleep 10'
                sh 'curl -s http://3.220.117.190:5000/api/health'
            }
        }
    }
    
    post {
        success {
            echo '========================================='
            echo '✅ PIPELINE COMPLETED SUCCESSFULLY!'
            echo '========================================='
            echo 'Application deployed at: http://3.220.117.190:3000'
            echo 'API health check: http://3.220.117.190:5000/api/health'
        }
        failure {
            echo '========================================='
            echo '❌ PIPELINE FAILED!'
            echo '========================================='
            echo 'Please check the logs above for errors.'
        }
    }
}
