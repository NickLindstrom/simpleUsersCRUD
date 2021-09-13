define(function(require) {
    'use strict';

    const nodeType = require('NodeTypeUtil');
    const resourceLocator = require('ResourceLocatorUtil');
    const restAPI = require('RestApi');


    let getExtPrincipalRepository = function() {
        const principalRepository = resourceLocator.getPrincipalRepository();
        const childNodes = principalRepository.getNodes();
        while (childNodes.hasNext()) {
            let child = childNodes.next();
            if (nodeType.isType(child, 'sv:externalPrincipalRepository')) {
                return child;
            }
        }
        return false;
    };

    return {
        get: function () {
            let externalPrincipalRepository = getExtPrincipalRepository();
            return restAPI.get(externalPrincipalRepository,'nodes');
        },
        create: function (data) {
            let externalPrincipalRepository = getExtPrincipalRepository();
            return restAPI.post(externalPrincipalRepository, 'simpleuser', {
                externalId: data.mail,
                properties: {
                    name: data.name,
                    mail: data.mail,
                    telephoneNumber: data.telephoneNumber
                    // Här sätts alla properties ni vill sätta på användarent
                    // Man kan hitta på egna properties också, tex:
                    // isTrustedUser: data.isTrustedUser,
                    // Dessa fält kan ni sedan hämta ut såhär:
                    // propertyUtil.getString('isTrustedUser', userNode);
                },
            });
        },
        update: function (data) {
            let userNode = resourceLocator.getNodeByIdentifier(data.nodeId);
            // viktigt att "data.props" är ett objekt och att man wrappar det objektet i ett eget objekt med en key "properties")
            return restAPI.put(userNode, 'properties', { properties: data.props }); 
        },
        delete: function (data) {
            let principalRepository = resourceLocator.getPrincipalRepository();
            let userNode = resourceLocator.getNodeByIdentifier(data.nodeId);
            // Anonymisering går inte att ångra... (Observera att denna görs på Principal Repository och inte External Principal Repository)
            return restAPI.delete(principalRepository,'anonymizeuser',userNode); 
            // Man kan istället enabla och disabla users, detta går då att toggla imellan om man ångrar sig
            // Alternativ:
            // restAPI.put(user, 'enablesimpleuser', { value: false }); // Disablar en användare
            // restAPI.put(user, 'enablesimpleuser', { value: true }); // Enablar en användare
        },
    };
});