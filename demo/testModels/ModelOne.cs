interface IModelable {

}

class ModelTwo {

}

class ModelOne: ModelTwo, IModelable {
    public string Name {get;set;}
    int Id {get;set;}
    int OtherInt {get;set;}
    float OtherFloat {get;set;}
    char OtherChar {get;set;}
}