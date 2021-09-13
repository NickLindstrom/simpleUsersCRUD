(function () {
  "use strict";
  const router = require("router");
  const userHandler = require("/module/userHandler");

  const privileged = require("privileged");

  router.get("/getUsers/", function (req, res) {
    let result;
    privileged.doPrivilegedAction(() => {
      try {
        result = userHandler.get();
      } catch (error) {
        res.json({ statusCode: 500, message: err });
      }
      res.json({ statusCode: 200, message: result });
    });
  });

  router.post("/createUser/", function (req, res) {
    let result;
    privileged.doPrivilegedAction(() => {
      try {
        result = userHandler.create(req.params);
      } catch (error) {
        res.json({ statusCode: 500, message: err });
      }
    });
    res.json({ statusCode: 200, message: result });
  });

  router.put("/updateUser/", function (req, res) {
    let result;
    privileged.doPrivilegedAction(() => {
      try {
        result = userHandler.update(req.params);
      } catch (error) {
        res.json({ statusCode: 500, message: err });
      }
    });
    res.json({ statusCode: 200, message: result });
  });
  router.delete("/deleteUser/", function (req, res) {
    let result;
    privileged.doPrivilegedAction(() => {
      try {
        result = userHandler.delete(req.params);
      } catch (error) {
        res.json({ statusCode: 500, message: err });
      }
    });
    res.json({ statusCode: 200, message: result });
  });
})();

/*
Exempel på data att skicka in i endpointsen:

/createUser:
{
	"name": "Nick",
    "mail": "nick@nick.se",
	"telephoneNumber": "07225156154"
}

/updateUser: 
{
    "nodeId": "255.1792b39917b3056b274eaaf",
    "props": {
        "mail": "nick@newDomain.se"
    }
}

// Kan dubbelkollas så det fungerar med en skriptmodul med denna kod:
const resourceLocator = require('ResourceLocatorUtil');
const property = require('PropertyUtil');
let user = resourceLocator.getNodeByIdentifier('255.1792b39917b3056b274eaaf'); // ID för den användarens nod
out.println(property.getString(user, 'mail'));

/deleteUser:
{
    "nodeId": "255.1792b39917b3056b274eaaf"
}
*/
