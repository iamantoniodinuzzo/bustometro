import { useReducer, useEffect } from 'react';
import { regioni } from '../constants';

const initialState = {
  parentela: null,
  adulti: 1,
  bambini: 0,
  costoCoperto: 80,
  figura: null,
  testimone: false,
  suocera: false,
  regione: 'centro',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PARENTELA': return { ...state, parentela: action.value };
    case 'SET_ADULTI': return { ...state, adulti: action.value };
    case 'SET_BAMBINI': return { ...state, bambini: action.value };
    case 'SET_COSTO_COPERTO': return { ...state, costoCoperto: action.value };
    case 'SET_FIGURA': return { ...state, figura: action.value };
    case 'SET_TESTIMONE': return { ...state, testimone: action.value };
    case 'SET_SUOCERA': return { ...state, suocera: action.value };
    case 'SELECT_REGIONE': return { ...state, regione: action.id, costoCoperto: action.coperto, figura: action.figura };
    case 'HYDRATE_FROM_URL': return { ...state, ...action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

export const useFormReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = parseFloat(params.get('p'));
    const i = parseInt(params.get('i'), 10);
    const b = parseInt(params.get('b'), 10);
    const cv = parseFloat(params.get('c'));
    const d = parseFloat(params.get('d'));
    const validParentele = [2.0, 1.5, 1.2, 1.0];
    const validFigure = [1.5, 1.3, 1.2, 1.0];
    const payload = {};
    if (validParentele.includes(p)) payload.parentela = p;
    if (Number.isFinite(i) && i >= 1 && i <= 10) payload.adulti = i;
    if (Number.isFinite(b) && b >= 0 && b <= 10) payload.bambini = b;
    if (Number.isFinite(cv) && cv >= 30 && cv <= 200) payload.costoCoperto = cv;
    if (validFigure.includes(d)) payload.figura = d;
    if (params.get('t') === '1') payload.testimone = true;
    if (params.get('s') === '1') payload.suocera = true;
    const r = params.get('r');
    if (['nord', 'centro', 'sud'].includes(r)) payload.regione = r;
    if (Object.keys(payload).length > 0) dispatch({ type: 'HYDRATE_FROM_URL', payload });
  }, []);

  return {
    parentela: state.parentela,
    setParentela: (value) => dispatch({ type: 'SET_PARENTELA', value }),
    adulti: state.adulti,
    setAdulti: (value) => dispatch({ type: 'SET_ADULTI', value }),
    bambini: state.bambini,
    setBambini: (value) => dispatch({ type: 'SET_BAMBINI', value }),
    costoCoperto: state.costoCoperto,
    setCostoCoperto: (value) => dispatch({ type: 'SET_COSTO_COPERTO', value }),
    figura: state.figura,
    setFigura: (value) => dispatch({ type: 'SET_FIGURA', value }),
    testimone: state.testimone,
    setTestimone: (value) => dispatch({ type: 'SET_TESTIMONE', value }),
    suocera: state.suocera,
    setSuocera: (value) => dispatch({ type: 'SET_SUOCERA', value }),
    regione: state.regione,
    selectRegione: (id) => {
      const cfg = regioni.find((r) => r.id === id);
      dispatch({ type: 'SELECT_REGIONE', id, coperto: cfg.coperto, figura: cfg.figura });
    },
    reset: () => dispatch({ type: 'RESET' }),
  };
};
