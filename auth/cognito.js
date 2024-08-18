const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const dotenv = require('dotenv');

dotenv.config();

const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const authenticateUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        const userData = {
            Username: username,
            Pool: userPool,
        };

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                resolve(result.getIdToken().getJwtToken());
            },
            onFailure: (err) => {
                reject(err);
            },
        });
    });
};

const registerUser = (email, password, name) => {
    return new Promise((resolve, reject) => {
        const attributeList = [
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'name',
                Value: name,
            }),
        ];

        userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result.user);
        });
    });
};


module.exports = {
    authenticateUser,
    registerUser,
};
