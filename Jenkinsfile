pipeline {
    agent any

    parameters {
        credentials(credentialType: 'com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl',
                    defaultValue: '',
                    description: 'Production deployment key',
                    // the credentials name used here must match the parameter passed to userColonPassword in the 'Deploy' stage below
                    name: 'GIT_CREDENTIALS',
                    required: true)
		string defaultValue: 'NPT', description: '', name: 'RNM_PROJECT', trim: true
        string defaultValue: 'NPT', description: '', name: 'RNM_COMPONENT', trim: true
        string defaultValue: 'bus-firenze-gui', description: '', name: 'RNM_SUBCOMPONENT', trim: true
        string defaultValue: '', description: '', name: 'REMOVE_SNAPSHOT', trim: true                       
    }
   
    environment { 
        GIT_AUTH = credentials('GIT_CREDENTIALS') 
        ARTIFACT = "${params.RNM_SUBCOMPONENT}"
        VERSION  = '0.0.0'       
        MASTER_BRANCH_NAME = 'main'
        NEXUS_DEPLOY = true
        UPDATE_GIT = false
        MOVE_JIRA_ISSUE = false
        COPY_ARTIFACT = false
        FOLDER_ARTIFACT_COPY = "dev-tech/ATECH-NPT/Dev/${ARTIFACT}"
        FOLDER = "dist"
        ARTIFACT_INCLUDE_GLO="*.zip"
    }

    stages {
        stage('Set Environment') {
            steps {
                script {
                    echo "Set Environment "
                    def packageJSON = readJSON file: 'package.json'
                    echo "version: ${packageJSON['version']}"
                    ARTIFACT = "${packageJSON.name}"
                    VERSION = packageJSON['version']
                    echo "Environment ${ARTIFACT} - ${VERSION}"
                }
            }
        }

        stage('Build Project') {
            steps {
                echo "Build "
                echo "Building ${ARTIFACT} - ${VERSION}"
                nodejs(nodeJSInstallationName: 'Node-14.17.0', configId: 'd1fbb428-bc33-489b-bb11-e2e807e439d9') { 
                    echo "Building ${ARTIFACT} - ${VERSION}"
                    sh 'npm config ls'
                    sh 'npm run build'
                }
            }
        }

        stage('Zip Deployable') {
            steps {
                script {
                    if (env.NEXUS_DEPLOY.toBoolean()) {
                        nodejs(nodeJSInstallationName: 'Node-14.17.0', configId: 'd1fbb428-bc33-489b-bb11-e2e807e439d9') {
                            echo "Zip ${ARTIFACT} - ${VERSION}"
                            zip zipFile: "${ARTIFACT}.zip", archive: false, dir: "${FOLDER}"                               
                        }
                    }
                }
            }
        }

        stage('Build Project AWS') {
            steps {
                echo "Build "
                echo "Building ${ARTIFACT} - ${VERSION}"
                nodejs(nodeJSInstallationName: 'Node-14.17.0', configId: 'd1fbb428-bc33-489b-bb11-e2e807e439d9') { 
                    echo "Building ${ARTIFACT} - ${VERSION}"
                    sh 'npm config ls'
                    sh 'npm run build-aws'
                }
            }
        }

        stage('Zip Deployable AWS') {
            steps {
                script {
                    if (env.NEXUS_DEPLOY.toBoolean()) {
                        nodejs(nodeJSInstallationName: 'Node-14.17.0', configId: 'd1fbb428-bc33-489b-bb11-e2e807e439d9') {
                            echo "Zip ${ARTIFACT} - ${VERSION}"
                            zip zipFile: "${ARTIFACT}-AWS.zip", archive: false, dir: "${FOLDER}"                               
                        }
                    }
                }
            }
        }
    
        stage('Release Project') {
            steps {
                    script {
                    if (env.UPDATE_GIT.toBoolean()) {
                        echo "Release ${ARTIFACT} - ${VERSION}"
                        nodejs(nodeJSInstallationName: 'Node-14.17.0') {
                            sh 'git checkout ${MASTER_BRANCH_NAME}'
                            sh 'git checkout develop'
                            sh 'git flow init -d'
                            sh 'git flow release start ' + "${VERSION}"
                            sh 'npm run tag'
                            sh 'git flow release finish -m "Release version" ' + "${VERSION}"
                           
                            echo "merge ${MASTER_BRANCH_NAME} on develop"
                            sh 'git checkout develop'
                            sh 'git merge ${MASTER_BRANCH_NAME} -m "merge on develop" --commit'
                            
                            echo "Push on git with user ${env.GIT_AUTH_USR}"
                            sh "git push https://${env.GIT_AUTH_USR}:${env.GIT_AUTH_PSW}@tch-gitlab01.gruppo.autostrade.it/npt/${ARTIFACT}.git --all"
                            sh "git push https://${env.GIT_AUTH_USR}:${env.GIT_AUTH_PSW}@tch-gitlab01.gruppo.autostrade.it/npt/${ARTIFACT}.git " + "${VERSION}"
                        }
                    }
                }
            }
        }

        

        stage('Move Jira Issues') {
            steps {
                script { 
                    if (env.MOVE_JIRA_ISSUE.toBoolean()) {
                        rnmTransitionIssues "${params.RNM_PROJECT}","${params.RNM_COMPONENT}","${params.RNM_SUBCOMPONENT}", "${VERSION}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                COPY_FOLDER = "/mnt/${FOLDER_ARTIFACT_COPY}/${VERSION}/${FOLDER}"
            }
            
        }
      
        success {
            script {
                if(env.COPY_ARTIFACT.toBoolean()) {
                    copyDeployable "${FOLDER_ARTIFACT_COPY}", "${FOLDER}", "${ARTIFACT_INCLUDE_GLO}", "${VERSION}"
                }
            }
        }
        cleanup {
            cleanWs()
        }
    }
}