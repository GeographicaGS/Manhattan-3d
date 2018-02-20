pipeline {
  environment {
    CRED = credentials("manhattan_3d")
  }
  agent {
    node {
      label 'docker'
    }
  }

  stages {
    stage('Building') {
      steps {
        script {
          shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
        }
        echo "Building manhattan_3d/${shortCommit}"
        sh "docker build --pull=true -t geographica/manhattan_3d ."
      }
    }

    stage('Linter') {
      steps {
        sh "docker run -i --rm geographica/manhattan_3d npm run-script lint"
      }
    }

    stage("Deploy") {
      when {
          anyOf {
              branch 'master';
              branch 'etisalat';
          }
      }
      steps {
        script {
          if (env.BRANCH_NAME == 'master') {
            DEPLOY_TO = "prod"
          }
          else if (env.BRANCH_NAME == 'etisalat') {
            DEPLOY_TO = "etisalat"
          }
        }
        sh "docker run -i --rm -v \$(pwd)/dist:/usr/src/app/dist geographica/manhattan_3d ng build --environment=prod -op dist/dist"
        sh "cp deploy/s3_website.${DEPLOY_TO}.yml s3_website.yml"
        sh "docker run --rm -i -v \$(pwd):/usr/src/app -e \"S3_WEBSITE_ID=${CRED_USR}\" -e \"S3_WEBSITE_SECRET=${CRED_PSW}\" geographica/s3_website cfg apply"
        sh "docker run --rm -i -v \$(pwd):/usr/src/app -e \"S3_WEBSITE_ID=${CRED_USR}\" -e \"S3_WEBSITE_SECRET=${CRED_PSW}\" geographica/s3_website push"
      }
      post {
       failure {
         echo "Pipeline is done"
         // notify users when the Pipeline fails
         mail to: 'build@geographica.gs',
         subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
         body: "Something is wrong with ${env.BUILD_URL}"
       }
     }
    }
  }
}
