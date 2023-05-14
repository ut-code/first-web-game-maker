import toTreeView from "./utils/toTreeView";
import pacmanTreeData from "./contents/treeData/pacmanTreeData";
import sugorokuTreeData from "./contents/treeData/sugorokuTreeData";
import shogiTreeData from "./contents/treeData/shogiTreeData";

const treeData = [sugorokuTreeData, shogiTreeData, pacmanTreeData];

const treeView = toTreeView(treeData);

export default treeView;
