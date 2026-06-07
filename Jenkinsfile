pipeline {
  agent any
  environment {
    IMAGE = "megoone/url-shortener"
  }
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t $IMAGE-backend:$BUILD_NUMBER ./backend'
        sh 'docker build -t $IMAGE-frontend:$BUILD_NUMBER ./frontend'
        sh 'docker tag $IMAGE-backend:$BUILD_NUMBER $IMAGE-backend:latest'
        sh 'docker tag $IMAGE-frontend:$BUILD_NUMBER $IMAGE-frontend:latest'
      }
    }
    stage('Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'USER',
          passwordVariable: 'PASS')]) {
          sh 'echo $PASS | docker login -u $USER --password-stdin'
          sh 'docker push $IMAGE-backend:$BUILD_NUMBER'
          sh 'docker push $IMAGE-backend:latest'
          sh 'docker push $IMAGE-frontend:$BUILD_NUMBER'
          sh 'docker push $IMAGE-frontend:latest'
          sh 'docker logout'
        }
      }
    }
  }
}