# 🌍 WanderLust - Airbnb-Style Travel Accommodations  

![WanderLust Banner](https://via.placeholder.com/1200x400/2D3748/FFFFFF?text=WanderLust+-+Discover+Your+Perfect+Stay)

**A full-stack travel booking platform** with property listings, reviews, and interactive maps.

🔗 **Live Demo:** [https://wanderlust-8bks.onrender.com/listings](https://wanderlust-8bks.onrender.com/listings)  
📌 **GitHub Repo:** [https://github.com/your-username/WanderLust](https://github.com/your-username/WanderLust)

---

## ✨ Features

### 🛎️ Core Functionality
- User authentication (Login/Signup)
- CRUD operations for property listings
- Interactive review system with average ratings
- Flash messages for user feedback

### 🗺️ Interactive Elements
- Leaflet.js map integration
- Responsive Bootstrap design
- Cloudinary image uploads

### ⚙️ Backend Tech
- Joi for input validation
- Express-session for auth
- MongoDB Atlas cloud database
- Error handling middleware

---

## 🛠 Tech Stack

| Category        | Technologies Used                     |
|-----------------|---------------------------------------|
| **Frontend**    | EJS, Bootstrap 5, Leaflet.js          |
| **Backend**     | Node.js, Express                      |
| **Database**    | MongoDB Atlas                         |
| **Validation**  | Joi                                   |
| **Storage**     | Cloudinary + Multer                   |
| **Auth**        | Passport.js, Express-session          |
| **Deployment**  | Render                                |

---

## 🚀 Installation

1. Clone the repo:
      ```bash
   git clone https://github.com/your-username/WanderLust.git
   cd WanderLust

2. Install dependencies:

      ```bash
   npm install

  3. create .env
      ```bash
            DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
            CLOUDINARY_CLOUD_NAME=your_cloud_name
            CLOUDINARY_KEY=your_api_key
            CLOUDINARY_SECRET=your_api_secret
            SESSION_SECRET=your_secret_key  

---  
  
  🏗️ Project Structure
  
  WanderLust/
  ├── controllers/
  │   ├── listings.js
  │   ├── reviews.js
  │   └── users.js
  ├── models/
  │   ├── listing.js
  │   ├── review.js
  │   └── user.js
  ├── public/
  │   ├── js/
  │   ├── css/
  │   └── images/
  ├── routes/
  │   ├── index.js
  │   ├── listings.js
  │   └── users.js
  ├── views/
  │   ├── listings/
  │   ├── partials/
  │   └── auth/
  ├── middleware.js
  └── app.js
  
---
  
  
**  🤝 Contributing**

  Fork the project
        
        Create your feature branch (git checkout -b feature/AmazingFeature)
        Commit your changes (git commit -m 'Add some AmazingFeature')
        Push to the branch (git push origin feature/AmazingFeature)
        Open a Pull Request
  
  📜 License
  Distributed under the MIT License. See LICENSE for more information.
  
  ✉️ Contact
    Nikhil - nikhil.garkoti0001@gmail.com 

---    
  
  🙌 Acknowledgments
  
    Leaflet.js for maps
    
    Bootstrap for UI components
    
    Cloudinary for image storage
  
  
  Key improvements:
  
    - Proper Markdown formatting throughout
    - Organized tech stack in a clean table
    - Added placeholder banners with theme colors
    - Structured installation steps clearly
    - Included project tree visualization
    - Added contact and acknowledgments sections

---    
  
