import { useForm } from "react-hook-form";

type ConfigFormProps = {
  mapSize?: number;
  frequency?: number;
  seed?: string;
  onSubmit: (config: { mapSize: number; frequency: number; seed: string }) => void;
};

export const ConfigForm = (config: ConfigFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<{
    mapSize: number;
    frequency: number;
    seed: string;
  }>({
    defaultValues: {
      mapSize: 600,
      frequency: 9,
      seed: '3nywolsp75h',
    },
  });

  const handleNewSeed = () => {
    const newSeed = Math.random().toString(36).substring(2, 15);
    setValue("seed", newSeed);
    const data = getValues();
    config.onSubmit({ ...data, seed: newSeed });
    console.log(`New seed: ${newSeed}`);
  };

  return (
    <form onSubmit={handleSubmit(config.onSubmit)}>
      <div className="mb-3">
        <label htmlFor="mapSizeInput" className="form-label">Map Size</label>
        <input type="number" className="form-control" id="mapSizeInput" placeholder="2000" {...register("mapSize")} />
      </div>
      <div className="mb-3">
        <label htmlFor="frequencyInput" className="form-label">Noise Frequency</label>
        <input type="number" className="form-control" id="frequencyInput" placeholder="7" {...register("frequency")} />
      </div>
      <div className="mb-3">
        <label htmlFor="seedInput" className="form-label">Seed</label>
        <input type="text" className="form-control" id="seedInput" placeholder="7" {...register("seed")} />
      </div>
      <div className="d-flex justify-content-between mb-3">
        <button type="button" className="btn btn-secondary btn-block" onClick={handleNewSeed}>New Seed</button>
        <button type="submit" className="btn btn-primary btn-block">Generate</button>
      </div>
    </form>
  )
}