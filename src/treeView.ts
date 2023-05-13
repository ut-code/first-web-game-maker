import toTreeView from "./utils/toTreeView";
import pwaMakerTreeData from "./contents/treeData/pwaMakerTreeData";
import sugorokuTreeData from "./contents/treeData/sugorokuTreeData";
import shogiTreeData from "./contents/treeData/shogiTreeData";

const treeData = [sugorokuTreeData, pwaMakerTreeData];

const treeView = toTreeView(treeData);

export default treeView;
