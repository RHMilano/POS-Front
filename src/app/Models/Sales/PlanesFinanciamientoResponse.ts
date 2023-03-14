import {CodigoRespuestaTCMM} from './CodigoRespuestaTCMM';
import {PlanFinanciamientoResponse} from './PlanFinanciamientoResponse';
import {DescuentoPromocionalAplicado} from './DescuentoPromocionalAplicado';
import {DescuentoPromocionalVentaModel} from '../Pagos/DescuentoPromocionalVenta.model';

export class PlanesFinanciamientoResponse {
    codigoRespuestaTCMM: CodigoRespuestaTCMM;
    planesFinanciamiento: Array<PlanFinanciamientoResponse>;
    descuentoPromocionalPrimeraCompra: DescuentoPromocionalVentaModel;
}
