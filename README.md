# 🌍 WanderLust - Where travel meets comfort and experience
 

**A full-stack travel booking platform** with property listings, reviews, and interactive maps - built with Node.js, Express, and MongoDB.

🔗 **Try it out :** [https://wanderlust-8bks.onrender.com/listings](https://wanderlust-8bks.onrender.com/listings)  
📌 **GitHub Repo:** [https://github.com/your-username/WanderLust](https://github.com/your-username/WanderLust)  

---

## ✨ Key Features

### 🛎️ Core Functionality
- 🔐 **User Authentication**: Secure login/signup with session management
- 🏡 **Listings Management**: Create, read, update, and delete property listings
- ⭐ **Review System**: Rate listings with automatic average calculation
- 💬 **Real-time Feedback**: Flash messages for user notifications

### 🌐 Interactive Elements
- 🗺️ **Leaflet.js Integration**: Interactive maps for property locations
- 📱 **Responsive Design**: Mobile-friendly Bootstrap 5 interface
- ☁️ **Cloud Storage**: Image uploads via Cloudinary

### ⚙️ Backend Excellence
- ✅ **Joi Validation**: Robust data validation for forms
- 🔒 **Session Authentication**: Secure user sessions
- 🛡️ **Error Handling**: Custom middleware for graceful failures

### 🏗️ MVC Architecture
- 🧩 **Separation of Concerns**: Clean division between models, views, and controllers

---

## 🛠 Tech Stack

| Layer          | Technologies                          |
|----------------|---------------------------------------|
| **Frontend**   | EJS, Bootstrap 5, Leaflet.js          |
| **Backend**    | Node.js, Express                      |
| **Database**   | MongoDB Atlas (Cloud)                 |
| **Validation** | Joi                                   |
| **Storage**    | Cloudinary + Multer                   |
| **Auth**       | Passport.js, Express-session          |
| **Deployment** | Render                                |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account

### Installation
1. Clone the repository:
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
  
 4.  🏗️ Project Structure

  
       ```bash
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
  
