export interface Assignee {
  id: number;
  name: string;
  initials: string;
  color: string;
}

export interface ProcessedTask {
  taskIdentifier: string;
  warningMessage: string;
}

export interface DistributedTask extends ProcessedTask {
  id: string;
  assignee: Assignee;
}

export interface AssigneeManagerProps {
  selectedFilter: string | null;
  onSelectFilter: (name: string | null) => void;
}

export interface TaskListProps {
  tasks: DistributedTask[];
  selectedFilter: string | null;
}
