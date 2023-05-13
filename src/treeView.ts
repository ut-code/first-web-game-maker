import toTreeView from "./utils/toTreeView";
import sugorokuTreeData from "./contents/treeData/sugorokuTreeData";
import shogiTreeData from "./contents/treeData/shogiTreeData";

const treeData = [sugorokuTreeData, shogiTreeData];

const treeView = toTreeView(treeData);

export default treeView;
