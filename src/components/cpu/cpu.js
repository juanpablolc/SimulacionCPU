import React, { Component } from 'react';

import {
  Button,
  Card,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';

import { randDarkColor } from '../../funciones';

import './styles.css';

import decodificadorInicial from './decodificadorInicial.json';
import memoriaInicial1 from './memoriaInicial1.json';
import memoriaInicial2 from './memoriaInicial2.json';
import memoriaInicial3 from './memoriaInicial3.json';

class CPU extends Component {
  constructor() {
    super();
    this.state = {
      decodificador: decodificadorInicial,
      memoria: [],
      acumulador: [{ color: '#000', valor: 0 }],
      registroEntrada: [],
      contador: [],
      registroInstrucciones: [],
      registroDirecciones: [],
      registroDatos: [],
      finalizado: false
    };
  }

  inicializarState = () => {
    this.setState({
      decodificador: decodificadorInicial,
      memoria: [],
      acumulador: [{ color: '#000', valor: 0 }],
      registroEntrada: [],
      contador: [],
      registroInstrucciones: [],
      registroDirecciones: [],
      registroDatos: []
    });
  };

  cargarMemoria = memoriaInicial => {
    this.inicializarState();
    this.setState({
      memoria: memoriaInicial.map(registro => ({ ...registro })),
      finalizado: false
    });
  };

  aumentarContador = () => {
    const colorCiclo = randDarkColor();
    const {
      memoria,
      contador,
      registroInstrucciones,
      registroDirecciones,
      registroDatos
    } = this.state;
    const contadorAumentado = contador.length;
    this.setState(
      {
        contador: [...contador, { color: colorCiclo, valor: contadorAumentado }],
        registroDirecciones: [
          ...registroDirecciones,
          { color: colorCiclo, valor: contadorAumentado }
        ]
      },
      () => {
        memoria.forEach(({ direccion, valor }) => {
          if (direccion === contadorAumentado) {
            const { registroDirecciones } = this.state;
            this.setState(
              {
                registroInstrucciones: [
                  ...registroInstrucciones,
                  {
                    color: colorCiclo,
                    valor: parseInt(
                      ('000000000000'.substr(valor.toString(2).length) + valor.toString(2)).slice(
                        0,
                        4
                      ),
                      2
                    )
                  }
                ],
                registroDirecciones: [
                  ...registroDirecciones,
                  {
                    color: colorCiclo,
                    valor: parseInt(
                      ('000000000000'.substr(valor.toString(2).length) + valor.toString(2)).slice(
                        -8
                      ),
                      2
                    )
                  }
                ],
                registroDatos: [...registroDatos, { color: colorCiclo, valor }]
              },
              () => {
                this.realizarOperacion(colorCiclo);
              }
            );
          }
        });
      }
    );
  };

  realizarOperacion = colorCiclo => {
    const { registroInstrucciones } = this.state;
    switch (registroInstrucciones[registroInstrucciones.length - 1].valor) {
      case 0:
        this.operacionAritmeticoLogica('suma', colorCiclo);
        break;
      case 1:
        this.operacionAritmeticoLogica('resta', colorCiclo);
        break;
      case 2:
        this.operacionAritmeticoLogica('producto', colorCiclo);
        break;
      case 3:
        this.operacionAritmeticoLogica('potencia', colorCiclo);
        break;
      case 4:
        this.operacionAritmeticoLogica('AND', colorCiclo);
        break;
      case 5:
        this.operacionAritmeticoLogica('OR', colorCiclo);
        break;
      case 6:
        this.moverAMemoria(colorCiclo);
        break;
      case 7:
        this.finalizar();
        break;
      case 8:
        this.reset(colorCiclo);
        break;
      case 9:
        this.operacionAritmeticoLogica('division', colorCiclo);
        break;
      case 10:
        this.operacionAritmeticoLogica('NOT', colorCiclo);
        break;
      case 11:
        this.operacionAritmeticoLogica('XOR', colorCiclo);
        break;
      default:
    }
  };

  operacionAritmeticoLogica = (operacion, colorCiclo) => {
    const { registroDatos, memoria } = this.state;
    const ultimoRegistroDatos = parseInt(
      (
        '000000000000'.substr(registroDatos[registroDatos.length - 1].valor.toString(2).length) +
        registroDatos[registroDatos.length - 1].valor.toString(2)
      ).slice(-8),
      2
    );
    memoria.forEach(({ direccion, valor }) => {
      if (direccion === ultimoRegistroDatos) {
        const { registroEntrada, acumulador } = this.state;
        let resultado;
        switch (operacion) {
          case 'suma':
            resultado = acumulador[acumulador.length - 1].valor + valor;
            break;
          case 'resta':
            resultado = acumulador[acumulador.length - 1].valor - valor;
            break;
          case 'producto':
            resultado = acumulador[acumulador.length - 1].valor * valor;
            break;
          case 'potencia':
            resultado = Math.pow(acumulador[acumulador.length - 1].valor, valor);
            break;
          case 'AND':
            resultado = acumulador[acumulador.length - 1].valor & valor;
            break;
          case 'OR':
            resultado = acumulador[acumulador.length - 1].valor | valor;
            break;
          case 'division':
            resultado = Math.floor(acumulador[acumulador.length - 1].valor / valor);
            break;
          case 'NOT':
            resultado = parseInt((~valor >>> 0).toString(2).slice(-12), 2);
            break;
          case 'XOR':
            resultado = acumulador[acumulador.length - 1].valor ^ valor;
            break;
          default:
        }
        this.setState({
          registroDatos: [...registroDatos, { color: colorCiclo, valor }],
          registroEntrada: [...registroEntrada, { color: colorCiclo, valor }],
          acumulador: [...acumulador, { color: colorCiclo, valor: resultado }]
        });
      }
    });
  };

  moverAMemoria = colorCiclo => {
    const { acumulador, registroDatos } = this.state;
    this.setState(
      {
        acumulador: [
          ...acumulador,
          { color: colorCiclo, valor: acumulador[acumulador.length - 1].valor }
        ],
        registroDatos: [
          ...registroDatos,
          { color: colorCiclo, valor: acumulador[acumulador.length - 1].valor }
        ]
      },
      () => {
        const { registroDirecciones, registroDatos, memoria } = this.state;
        let nuevaMemoria = [...memoria];
        const registroMemoria = nuevaMemoria.find(
          ({ direccion }) => direccion === registroDirecciones[registroDirecciones.length - 1].valor
        );
        if (registroMemoria) {
          registroMemoria.color = colorCiclo;
          registroMemoria.valor = registroDatos[registroDatos.length - 1].valor;
        } else {
          nuevaMemoria.push({
            color: colorCiclo,
            direccion: registroDirecciones[registroDirecciones.length - 1].valor,
            valor: registroDatos[registroDatos.length - 1].valor
          });
        }
        this.setState({ memoria: nuevaMemoria });
      }
    );
  };

  finalizar = () => {
    this.setState({ finalizado: true });
  };

  reset = colorCiclo => {
    const { registroDirecciones, memoria } = this.state;
    memoria.forEach(({ direccion, valor }) => {
      if (direccion === registroDirecciones[registroDirecciones.length - 1].valor) {
        const { registroDatos } = this.state;
        this.setState(
          {
            registroDatos: [
              ...registroDatos,
              {
                color: colorCiclo,
                valor: parseInt(
                  ('000000000000'.substr(valor.toString(2).length) + valor.toString(2)).slice(-8),
                  2
                )
              }
            ]
          },
          () => {
            const { registroDatos, registroEntrada, acumulador } = this.state;
            this.setState({
              acumulador: [
                ...acumulador,
                { color: colorCiclo, valor: registroDatos[registroDatos.length - 1].valor }
              ],
              registroEntrada: [
                ...registroEntrada,
                { color: colorCiclo, valor: registroDatos[registroDatos.length - 1].valor }
              ]
            });
          }
        );
      }
    });
  };

  render() {
    const {
      decodificador,
      memoria,
      acumulador,
      registroEntrada,
      contador,
      registroInstrucciones,
      registroDirecciones,
      registroDatos,
      finalizado
    } = this.state;
    return (
      <div>
        <Grid alignItems="flex-start" container spacing={16}>
          <Grid item sm="auto" xs={12}>
            <Button
              fullWidth
              color="primary"
              className="botonEncabezado"
              onClick={() => {
                this.cargarMemoria(memoriaInicial1);
              }}
              variant="contained"
            >
              Cargar operación 1
            </Button>
          </Grid>
          <Grid item sm="auto" xs={12}>
            <Button
              fullWidth
              color="primary"
              className="botonEncabezado"
              onClick={() => {
                this.cargarMemoria(memoriaInicial2);
              }}
              variant="contained"
            >
              Cargar operación 2
            </Button>
          </Grid>
          <Grid item sm="auto" xs={12}>
            <Button
              fullWidth
              color="primary"
              className="botonEncabezado"
              onClick={() => {
                this.cargarMemoria(memoriaInicial3);
              }}
              variant="contained"
            >
              Cargar operación 3
            </Button>
          </Grid>
          <Grid item sm="auto" xs={12}>
            <Button
              fullWidth
              color="secondary"
              className="botonEncabezado"
              disabled={finalizado}
              onClick={this.aumentarContador}
              variant="contained"
            >
              Siguiente clock
              <TimerIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid container direction="column" item lg={4} md={6} spacing={16} xs={12}>
            <Grid item>
              <Card>
                <CardHeader
                  disableTypography
                  title={<Typography variant="h6">Decodificador</Typography>}
                />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Instrucción</TableCell>
                      <TableCell>Operación</TableCell>
                      <TableCell>Comentario</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {decodificador.map(operacion => (
                      <TableRow key={operacion.instruccion}>
                        <TableCell>
                          {'0000'.substr(operacion.instruccion.toString(2).length) +
                            operacion.instruccion.toString(2)}
                        </TableCell>
                        <TableCell>{operacion.operacion}</TableCell>
                        <TableCell>{operacion.comentario}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>
            <Grid container item spacing={16}>
              <Grid item xs={6}>
                <Card>
                  <CardHeader
                    disableTypography
                    title={<Typography variant="h6">Contador</Typography>}
                  />
                  <Table>
                    <TableBody>
                      {contador.map(({ color, valor }, indice) => (
                        <TableRow key={indice}>
                          <TableCell style={{ color }}>
                            {'00000000'.substr(valor.toString(2).length) + valor.toString(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardHeader
                    disableTypography
                    title={<Typography variant="h6">Registro de instrucciones</Typography>}
                  />
                  <Table>
                    <TableBody>
                      {registroInstrucciones.map(({ color, valor }, indice) => (
                        <TableRow key={indice}>
                          <TableCell style={{ color }}>
                            {'0000'.substr(valor.toString(2).length) + valor.toString(2)}
                          </TableCell>
                          <TableCell style={{ color }}>
                            {
                              decodificador.find(({ instruccion }) => instruccion === valor)
                                .comentario
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="column" item lg={4} md={6} spacing={16} xs={12}>
            <Grid item>
              <Card>
                <CardHeader
                  disableTypography
                  title={<Typography variant="h6">Memoria</Typography>}
                />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Dirección</TableCell>
                      <TableCell>Contenido</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {memoria.map(({ color, direccion, valor }) => (
                      <TableRow key={direccion}>
                        <TableCell style={{ color }}>
                          {'00000000'.substr(direccion.toString(2).length) + direccion.toString(2)}
                        </TableCell>
                        <TableCell style={{ color }}>
                          {valor !== null &&
                            '000000000000'.substr(valor.toString(2).length) + valor.toString(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardHeader
                  disableTypography
                  title={<Typography variant="h6">Registro de direcciones</Typography>}
                />
                <Table>
                  <TableBody>
                    {registroDirecciones.map(({ color, valor }, indice) => (
                      <TableRow key={indice}>
                        <TableCell style={{ color }}>
                          {'00000000'.substr(valor.toString(2).length) + valor.toString(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>
          </Grid>
          <Grid container direction="column" item lg={4} md={6} spacing={16} xs={12}>
            <Grid item>
              <Card>
                <CardHeader disableTypography title={<Typography variant="h6">ALU</Typography>} />
                <Grid container spacing={16}>
                  <Grid item xs={6}>
                    <Card>
                      <CardHeader
                        disableTypography
                        title={<Typography variant="h6">Acumulador</Typography>}
                      />
                      <Table>
                        <TableBody>
                          {acumulador.map(({ color, valor }, indice) => (
                            <TableRow key={indice}>
                              <TableCell style={{ color }}>
                                {'000000000000'.substr(valor.toString(2).length) +
                                  valor.toString(2)}
                              </TableCell>
                              <TableCell style={{ color }}>{valor}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardHeader
                        disableTypography
                        title={<Typography variant="h6">Registro de entrada</Typography>}
                      />
                      <Table>
                        <TableBody>
                          {registroEntrada.map(({ color, valor }, indice) => (
                            <TableRow key={indice}>
                              <TableCell style={{ color }}>
                                {'000000000000'.substr(valor.toString(2).length) +
                                  valor.toString(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardHeader
                  disableTypography
                  title={<Typography variant="h6">Registro de datos</Typography>}
                />
                <Table>
                  <TableBody>
                    {registroDatos.map(({ color, valor }, indice) => (
                      <TableRow key={indice}>
                        <TableCell style={{ color }}>
                          {'000000000000'.substr(valor.toString(2).length) + valor.toString(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <div className="marcaDeAgua">
          <Typography variant="h5">Simulación CPU</Typography>
          <Typography variant="h6">Arquitectura de Microcontroladores 2019-1</Typography>
          <Typography variant="h6">Universidad de La Sabana</Typography>
          <div>Nicolás Mateo Bossa Forero</div>
          <div>Juan Pablo López Cifuentes</div>
          <div>Jenncy Joham Villamizar Rodríguez</div>
        </div>
      </div>
    );
  }
}

export default CPU;
