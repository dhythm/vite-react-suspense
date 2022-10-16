import { FC, Suspense, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <RenderingNotifier name="outside-Suspense" />
      <Suspense fallback={<p>Loading...</p>}>
        <DataLoader />
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
  await sleep(1000);
  return `Hello, ${(Math.random() * 1000).toFixed(0)}`;
}

let data: string | undefined;
// const DataLoader: FC = () => {
//   if (data === undefined) {
//     throw fetchData().then((d) => (data = d));
//   }

//   return <div>Data is {data}</div>;
// };
function useData(): string {
  if (data === undefined) {
    throw fetchData().then((d) => (data = d));
  }
  return data;
}
const DataLoader: FC = () => {
  const data = useData();
  return <div>Data is {data}</div>;
};

export default App;
