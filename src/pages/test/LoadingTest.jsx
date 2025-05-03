import { useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";

import { useLoading } from "context/LoadingContext";

const LoadingTest = () => {
  const { isloading, setLoading } = useLoading();
  const [Value, setValue] = useState(70);

  return (
    <div>
      <div className="card p-3 mb-3">
        <h1>Teste de carregamento</h1>
        <p className="fs-5">
          Esta é uma página de teste para estado de carregamento.
        </p>
        <p className="fs-6">Esta carregamendo: {isloading ? "Sim" : "Não"}</p>
      </div>

      <div className="card p-3 d-flex justify-content-center gap-3 w-50">
        <div className="w-14rem">
          <label>Tempo em segundos</label>
          <InputText
            value={Value}
            onChange={(e) => setValue(e.target.value)}
            className="w-100"
          />
          <Slider
            value={Value}
            onChange={(e) => setValue(e.value)}
            className="w-100"
          />
        </div>
        <Button
          label="Mostra caregamento"
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, Value * 100);
          }}
        />
      </div>
    </div>
  );
};

export default LoadingTest;
