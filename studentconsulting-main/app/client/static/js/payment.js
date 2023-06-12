
function pay_job() {

var stripe = Stripe("pk_test_51IfhsnIyy0hEGyMV6el0guHYj3vjLOrWxGAm20PYjYoKShwT23BnI394bnimktnu6BBDXwRchEBC4axfyznA0RiO00OWmDzv5Z");
user_id = JSON.parse(sessionStorage.getItem('user')).id;
console.log(user_id)
        fetch("/create-checkout-session", {
          method: "POST",
          body: JSON.stringify({'user_id': user_id}),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }

        })
          .then(function (response) {
            return response.json();
          })
          .then(function (session) {
            return stripe.redirectToCheckout({ sessionId: session.id });
          })
          .then(function (result) {
            if (result.error) {
              alert(result.error.message);
            }
          })
          .catch(function (error) {
            console.error("Error:", error);
          });
      }




