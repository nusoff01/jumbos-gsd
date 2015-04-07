P2PText - The textbook exhange network for Tufts students

Pitch:
Currently, how can a student buy their textbooks at Tufts? There are a couple of options. From most to least expensive, hey are:

1) Buy or rent from the bookstore
	Upsides: Book is going to be either new or in great condition. Definitely going to have what you need.
	Downsides: E.X.P.E.N.S.I.V.E. Going to have to pay full retail price.

2) Buy from the an online retailor
	Upsides: Vast selection, you pay for what you get in terms of quality.
	Downsides: Books get lost when shipping, might be hard to find some books, and you can't be sure of how truthful the evaluation of a book is.

3) Buy from another student
	Upsides: C.H.E.A.P.
	Downsides: Hard to find what you're looking for, might not find the textbook you need for a class. Quality will most likely be lower.

P2PText tries to take the best of each of these options and combine them into one tool for students looking for books. Books are cheap because they are sold directly between users. Books are going to be available because there is finally one unified place where everyone can sell their books. And quality is virtually assured since a buyer can inspect the book before they make the purchase.

ABSTRACT IMPLEMENTATION

Users sign up for P2PText using their Tufts email address. They can create their own username, which is their ID in the site. Once they are a member, they can buy and sell textbooks in the marketplace. 

Putting up a book for sale - Users define the title of their book, the class it is used in (if there is one), and the quality of the book. 

Buying a book - Users can search for books by class or by book title. They can organize results by quality or price. Once they find a book they want to by, they can commit to buy the book. In doing so, this allows them to establish contact with the owner of the book. Then the two parties can establish a time and a place to meet and exchange the book for cash. Once an offer is made by the buyer, the status of the book goes from "for sale" to "pending sale" and is removed from the list of books on sale. An email notification is sent to the seller. If they see a time that works for them within the range the buyer has suggested, they can set an exact time and location, or keep sending messages back and forth until they come to this point. Once a meeting is finalized, the buyer and seller can meet up! After that time, the seller will receive a notification that they need to take their book off the marketplace if they completed the sale. If they do, the book status will go from "pending sale" to "sold". 

Questions

TECHNICAL IMPLEMENTATION

Technologies used - On the backend, we will be using the Express framework and Node.js, and mongodb as our storage.



