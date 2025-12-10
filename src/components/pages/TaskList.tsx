import HomeTemplate from "../templates/HomeTemplate";
import TaskList from "../molecules/TaskList";
import PekerjaShell from "../shell/PekerjaShell";
const TaskListPage = () => {
    return (
             <PekerjaShell>
                <HomeTemplate>
                    <TaskList />
                </HomeTemplate>
            </PekerjaShell>
    )
}

export default TaskListPage;