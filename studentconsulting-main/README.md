# TDDD83-kandidatprojekt-grupp09

Kandidatprojekt grupp 09 vt 2021

## HOW TO START

1. Install required dependencies with `pip install -r requirements.txt`
2. Run the file dbscript.py with Python to initialize database, can be done by typing `python dbscript.py` in terminal
3. Run the file run.py to start the server, can be done by typing `python run.py` in terminal
4. Access the application by going to [`http://localhost:5000/`](http://localhost:5000/) in a browser


## HOW TO MAKE THE APPLICATION WORK WITH STRIPE

1. Install the stripe-package via 'pip3 install stripe'
2. Download the latest version of Stripe CLI from https://github.com/stripe/stripe-cli/releases/tag/v1.5.14
3. Extract the downloaded CLI-file (Unzip)
4. Run the extracted file
	- If you get a warning about the file being a security issue:
		On Windows: Just click run anyway
		On Mac: Got to ; Systeminställningar/Säkerhet&integritet/Allmänt/”Tillåt stripe att köra ända
5. (Optional) Move the extracted file to the development environment
6. On windows: Open the CMD, this is done by clicking on the windows-button and 'R' at the same time. Type in cmd and hit enter.
		go to the folder where you have your Stripe CLI installed.

   On MAC:     Open a new terminal-window in the folder where you have your Stripe CLI-installed.

7. In your terminal window put in: stripe login. You will be redirected to stripes website by clicking on enter or pasting the link
   that appears in the terminal.
	username: adam.e.astrom@gmail.com
	password: Kandidat2k21

8. After you've logged in go to your terminal window and put in: stripe listen --forward-to 127.0.0.1:5000/stripe_webhook

9. Open a new terminal window and go to the project folder, activate your virtual environment and run the server as usual.

## HOW TO MAKE A PAYMENT

1. Add a new joblisting

2. In the checkout put in the required information
	Email: Any email
	Card number: 42424242424242
	Exp date: Some date in the future
	CVV: Any three numbers
	Name on card: Any string





