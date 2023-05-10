import toTreeView from "./utils/toTreeView";
import htmlTreeData from "./contents/treeData/htmlTreeData";
import cssTreeData from "./contents/treeData/cssTreeData";
import sugorokuTreeData from "./contents/treeData/sugorokuTreeData";

const treeData = [htmlTreeData, cssTreeData,sugorokuTreeData];

const treeView = toTreeView(treeData);

export default treeView;
