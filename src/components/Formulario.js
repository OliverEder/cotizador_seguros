import React, {useState} from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import {obtenerDiferenciaYear, calcularMarca, obtenerPlan} from '../helper';

const Campo = styled.div`
        display:flex;
        margin-bottom:1rem;
        align-items: center;
    `;

const Label = styled.label`
    flex:0 0 100px;
`;

const Select = styled.select`
    display:block;
    width: 100%;
    padding: 1rem;
    border:1px solid;
    -webkit-appearance:none; 
`;

const InputRadio = styled.input`
    margin: 0 1rem;
`;

const Boton = styled.button`
    background-color: #00838F;
    font-size: 16px;
    width: 100%;
    padding: 1rem;
    color:#FFFFFF;
    font-weight: bold;
    border:none;
    transition: background-color .3s ease;
    margin-top: 2rem;

    &:hover{
        background-color: #26C6DA;
        cursor:pointer;
    }
`;

const Error = styled.div`
    background-color: red;
    color: white;
    padding: 1rem;
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;
`;

const Formulario = ({guardarResumen, guardarCargando}) => {
    const [datos, guardarDatos] = useState({
        marca:"",
        year:"",
        plan: "",
    });

    const [error, guardarError] = useState(false);
  
    //extraer los valores del state
    const { marca, year, plan } = datos;

    //Leer los datos del formulario y colocarlos en el state
    const obtenerInformacion = e => {
        guardarDatos({
            ...datos, [e.target.name] : e.target.value
        })
    }

    //Cuando el usuario presiona submit
    const cotizarSeguro = e => {
        e.preventDefault();
        if(
            marca.trim() === "" || 
            year.trim() === "" || 
            plan.trim() === ""
        ){
            guardarError(true);
            return;
        }

        guardarError(false);

        //obtener la diferencia de años
        const diferencia = obtenerDiferenciaYear(year);
        //una base de de 2000
        let resultado = 2000;
        //por cada año hay que restar el 3% del valor
        resultado -= ((diferencia*3) * resultado) / 100
        // americano 15%
        // asiatico 5%
        // Europeo 30%
        resultado = resultado * calcularMarca(marca);
        //Basico 20%
        //Completo 50%
        resultado = parseFloat(resultado * obtenerPlan(plan)).toFixed(2) ;
        guardarCargando(true);
        //total
        setTimeout(()=>{
            guardarResumen({
                cotizacion: Number(resultado),
                datos
            });
            guardarCargando(false);
        }, 3000);
    }

    return ( 
        <form
            onSubmit={cotizarSeguro }
        >
            {error ? <Error>Todos los campos son obligatorios</Error>: null}
            <Campo>
                <Label>Marca</Label>
                <Select
                    name="marca"
                    value={marca}
                    onChange={obtenerInformacion}
                >
                    <option value="">---Selecciones---</option>
                    <option value="americano">Americano</option>
                    <option value="europeo">Europeo</option>
                    <option value="asiatico">Asiatico</option>
                </Select>
            </Campo>
            <Campo>
                <Label>Año</Label>
                <Select
                    name="year"
                    value={year}
                    onChange={obtenerInformacion}
                >
                    <option value="">---Selecciones---</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                </Select>
            </Campo>
            <Campo>
                <Label>Plan</Label>
                <InputRadio
                    type="radio"
                    name="plan"
                    value="basico"
                    checked={plan === "basico"}
                    onChange={obtenerInformacion}
                /> Basico

                <InputRadio
                    type="radio"
                    name="plan"
                    value="Completo"
                    checked={plan === "completo"}
                    onChange={obtenerInformacion}
                /> Completo
            </Campo>
            <Boton type="submit">Cotizar</Boton>
        </form>
    );
}
Formulario.propTypes = {
    guardarResumen: PropTypes.func.isRequired, 
    guardarCargando: PropTypes.func.isRequired
}

export default Formulario;