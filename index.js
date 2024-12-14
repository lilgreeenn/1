import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Read pets data from data.json
let pets = JSON.parse(fs.readFileSync('./data.json', 'utf8')).pets;

// Get all pets
app.get('/api/pets', (req, res) => {
  const { type, status, breed } = req.query;
  let filteredPets = [...pets];

  if (type) {
    filteredPets = filteredPets.filter(pet => pet.type.toLowerCase() === type.toLowerCase());
  }
  if (status) {
    filteredPets = filteredPets.filter(pet => pet.status.toLowerCase() === status.toLowerCase());
  }
  if (breed) {
    filteredPets = filteredPets.filter(pet => pet.breed.toLowerCase().includes(breed.toLowerCase()));
  }

  res.json(filteredPets);
});

// Get single pet
app.get('/api/pets/:id', (req, res) => {
  const pet = pets.find(p => p.id === parseInt(req.params.id));
  if (!pet) return res.status(404).json({ message: "Pet not found" });
  res.json(pet);
});

// Add new pet
app.post('/api/pets', (req, res) => {
  const newPet = {
    id: pets.length + 1,
    ...req.body,
    status: "Available",
    health_status: req.body.health_status || "Pending Check",
    special_needs: req.body.special_needs || false
  };
  pets.push(newPet);
  savePetsToFile();
  res.status(201).json(newPet);
});

// Update pet information
app.put('/api/pets/:id', (req, res) => {
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id));
  if (petIndex === -1) return res.status(404).json({ message: "Pet not found" });
  
  pets[petIndex] = {
    ...pets[petIndex],
    ...req.body
  };
  savePetsToFile();
  res.json(pets[petIndex]);
});

// Delete pet
app.delete('/api/pets/:id', (req, res) => {
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id));
  if (petIndex === -1) return res.status(404).json({ message: "Pet not found" });
  
  pets = pets.filter(p => p.id !== parseInt(req.params.id));
  savePetsToFile();
  res.status(204).send();
});

// Submit adoption application
app.post('/api/pets/:id/adopt', (req, res) => {
  const pet = pets.find(p => p.id === parseInt(req.params.id));
  if (!pet) return res.status(404).json({ message: "Pet not found" });
  if (pet.status !== "Available") {
    return res.status(400).json({ message: "This pet is not available for adoption" });
  }

  const application = {
    applicant_name: req.body.applicant_name,
    email: req.body.email,
    phone: req.body.phone,
    housing_type: req.body.housing_type,
    has_other_pets: req.body.has_other_pets,
    application_date: new Date()
  };

  pet.status = "Pending";
  pet.current_application = application;
  
  savePetsToFile();
  res.json({
    message: "Adoption application submitted successfully",
    pet
  });
});

// Helper function to save pets data to file
function savePetsToFile() {
  fs.writeFileSync('./data.json', JSON.stringify({ pets }, null, 2));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});