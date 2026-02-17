# Neural Breach - Campus Resource Hub

A comprehensive **Campus Academic Resource Sharing Platform** that enables students to upload, organize, search, and download academic resources such as notes, question papers, and study materials. Built for collaborative learning with features like content rating and recognition points.

## 🚀 Features

- **📚 Resource Management**: Upload and organize academic materials (notes, PDFs, question papers)
- **🔍 Smart Search**: Find resources by course, subject, or keyword
- **⭐ Rating System**: Rate and review shared content
- **🏆 Recognition Points**: Earn points for contributing valuable resources
- **📅 Academic Calendar**: Track important dates and deadlines
- **📍 Library Finder**: Locate nearby libraries on an interactive map
- **👥 User Profiles**: Manage your uploads and downloads

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Leaflet** - Interactive maps for library finder

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB Atlas** - Cloud database
- **Python 3.x** - Backend logic

## 📁 Project Structure

```
campus-resource-hub/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # Pages and routes
│   │   └── components/# Reusable components
│   └── public/        # Static assets
├── backend/           # FastAPI server
│   ├── main.py       # API endpoints
│   ├── database.py   # MongoDB connection
│   └── seed_data.py  # Sample data
└── run_dev.bat       # Development startup script
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Guneet-syan/Neural_Breach.git
   cd Neural_Breach
   ```

2. **Set up Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file with your MongoDB credentials
   echo "MONGODB_URL=your_mongodb_connection_string" > .env
   echo "DATABASE_NAME=Hackathon" >> .env
   
   # Run the backend
   python main.py
   ```

3. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Quick Start (Windows)
Simply run the batch file:
```bash
run_dev.bat
```

## 📸 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- **Guneet** - [@Guneet-syan](https://github.com/Guneet-syan)

## 🙏 Acknowledgments

Built for hackathon to promote collaborative learning and academic resource sharing among students.

---

⭐ Star this repository if you find it helpful!
