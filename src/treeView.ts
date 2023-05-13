import toTreeView from "./utils/toTreeView";
import htmlTreeData from "./contents/treeData/htmlTreeData";
import sugorokuTreeData from "./contents/treeData/sugorokuTreeData";
import shogiTreeData from "./contents/treeData/shogiTreeData";

const treeData = [sugorokuTreeData];

const treeView = toTreeView(treeData);

export default treeView;
