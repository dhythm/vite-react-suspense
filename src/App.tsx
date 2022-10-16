import { FC, Suspense, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Loadable } from "./Loadable";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div className="App">
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <RenderingNotifier name="outside-Suspense" />
//       <Suspense fallback={<p>Loading...</p>}>
//         <DataLoaderAlpha />
//         <DataLoaderBeta />
//       </Suspense>
//     </div>
//   );
// }

function App() {
  const [data1] = useState(() => new Loadable(fetchData()));
  const [data2] = useState(() => new Loadable(fetchData()));
  const [data3] = useState(() => new Loadable(fetchData()));
  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DataLoaderGamma data={data1} />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <DataLoaderGamma data={data2} />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <DataLoaderGamma data={data3} />
      </Suspense>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const AlwaysSuspend: FC = () => {
  throw sleep(1000);
};

const SometimesSuspend: FC = () => {
  if (Math.random() < 0.5) {
    throw sleep(1000);
  }
  return <p>Hello, world!</p>;
};

type RenderingNotifierProps = { name: string };
const RenderingNotifier: FC<RenderingNotifierProps> = ({ name }) => {
  console.log(`${name} is rendered`);

  return null;
};

async function fetchData(): Promise<string> {
  await sleep(Math.floor(Math.random() * 1000));
  return `Hello, ${(Math.random() * 1000).toFixed(0)}`;
}

// let data: string | undefined;
// const DataLoader: FC = () => {
//   if (data === undefined) {
//     throw fetchData().then((d) => (data = d));
//   }

//   return <div>Data is {data}</div>;
// };
const dataMap: Map<string, string> = new Map();
function useData(cacheKey: string): string {
  const cachedData = dataMap.get(cacheKey);
  if (cachedData === undefined) {
    throw fetchData().then((d) => dataMap.set(cacheKey, d));
  }
  return cachedData;
}

const dataMapAlternative: Map<string, unknown> = new Map();
export function useDataAlternative<T>(
  cacheKey: string,
  fetch: () => Promise<T>
): T {
  const cachedData = dataMapAlternative.get(cacheKey) as T | undefined;
  if (cachedData === undefined) {
    throw fetch().then((d) => dataMapAlternative.set(cacheKey, d));
  }
  return cachedData;
}

const DataLoaderAlpha: FC = () => {
  const data = useData("alpha");
  return <div>Data is {data}</div>;
};
const DataLoaderBeta: FC = () => {
  const data = useData("beta");
  return <div>Data is {data}</div>;
};
const DataLoaderGamma: FC<{ data: Loadable<string> }> = ({ data }) => {
  const value = data.getOrThrow();
  return (
    <div>
      <div>Data is {value}</div>
    </div>
  );
};

export default App;
