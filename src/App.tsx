import WorkflowDiagram from "./components/WorkflowDiagram";
import data from "./data.json";
import "./App.css";
import WorkflowEditor from "./pages/automation/EditorPage";

function App() {

  return (
    <div>
      {/* <WorkflowDiagram initData={data} /> */}
      <WorkflowEditor />
    </div>
  )
}

export default App
