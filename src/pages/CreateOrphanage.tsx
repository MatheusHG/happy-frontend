import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from 'react-icons/fi';

import api from '../services/api';
import mapIcon from '../utils/mapIcon';

import SideBar from '../components/SideBar';

import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/pages/create-orphanage.css';
import '../styles/response/create-orphanage.css';


function LightOrDark(){
    const date = new Date();
    const Hours = date.getHours();

    var theme = "light";
    if(Hours >= 18 || Hours < 5) theme = "dark";
    
    return theme;
}

toast.configure()

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  function handleMapClick(event: LeafletMouseEvent){
    const { lat, lng } = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files){
      return;
    }

    if(images.length !== 0){
      const selectedImages = Array.from(event.target.files);
      images.forEach(image => {
        selectedImages.push(image);
      })

      setImages(selectedImages);

      const selectedImagesPreview = selectedImages.map(image => {
        return URL.createObjectURL(image);
      })
  
      setPreviewImages(selectedImagesPreview);
    }

    else {
      const selectedImages = Array.from(event.target.files);

      setImages(selectedImages);

      const selectedImagesPreview = selectedImages.map(image => {
        return URL.createObjectURL(image);
      })

      setPreviewImages(selectedImagesPreview);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try{
      const { latitude, longitude } = position;
  
      const data = new FormData();
  
      data.append('name', name);
      data.append('about', about);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('instructions', instructions);
      data.append('opening_hours', opening_hours);
      data.append('open_on_weekends', String(open_on_weekends));
  
      if(images.length === 0) return toast("Foto do Orfanato Obrigatória", {type: "warning"});

      images.forEach(image => {
        data.append('images', image);
      })
  
      await api.post('orphanages', data)
  
      toast('Cadastro realizado com Sucesso!', {type: 'success', autoClose: 3000, transition: Zoom});
  
      history.push('/app');
    } catch(error){
      if(error.response.data.message.about[0]) toast(error.response.data.message.about[0], {type: "warning"})
      if(error.response.data.message.instructions[0]) toast(error.response.data.message.instructions[0], {type: "warning"})
      if(error.response.data.message.name[0]) toast(error.response.data.message.name[0], {type: "warning"})
      if(error.response.data.message.opening_hours[0]) toast(error.response.data.message.opening_hours[0], {type: "warning"})
    }

  }

  return (
    <div id="page-create-orphanage">
      <SideBar />
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-7.2257601,-35.8798346]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/${LightOrDark()}-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { position.latitude !== 0 && (
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[
                    position.latitude, 
                    position.longitude
                  ]} 
                />
              ) }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={name} 
                onChange={event => setName(event.target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="name" 
                value={about}
                onChange={event => setAbout(event.target.value)} 
                maxLength={300} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={name} />
                  )
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple onChange={handleSelectImages} type="file" id="image[]" />

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <input 
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button 
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;