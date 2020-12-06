# Run Code 
node index

# List of APi

1.Create a new Account
method = post
http://localhost:3000/createaccount

request body 
{
	"name" : "tes1t",
	"amount":230
}


2.View All Bank account list
method = get
http://localhost:3000/listall


3.Amount transfer
method = post
http://localhost:3000/transfer

request body
{
	"youraccountno":"11607254988413",
	"transferaccountno":"21607254990235",
	"amount":5
}

4.chcek Account Balance
method = get
http://localhost:3000/checkbalance?accountid=21607254990235


5.Tanscation History
method = get
http://localhost:3000/histroy?accountid=21607254990235

