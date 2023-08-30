pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('docker_login')
  }
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t divanshreevatsa/jenkins_test_docker .'
      }
    }
    stage('Login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    stage('Push') {
      steps {
        sh 'docker push divanshreevatsa/jenkins_test_docker'
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}
