module Level3Init exposing (init)

{-| Init of Level3 Model.


# init

@docs init

-}

import Array
import Boundary
import Brick
import Browser.Dom exposing (getViewport)
import EndPoint
import Event
import GlobalBasics
import Level3Type
import MainType
import Needle
import NoticeBoard
import Player
import SavePoint
import Task
import Event exposing (Event)
import Brick exposing (BrickAppearance(..))
import Event exposing (EventIfStartAct(..))
import Brick exposing (Brick)


{-| `init` of Level3 \`Model
-}
init : () -> ( Level3Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 90 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ 
                    ]
            , boundary = Boundary.normalInit
            , player = Player.init (  50.0, 490.0  )
            , bricks =
                Array.fromList
                    (List.concat
                        [ 
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 89, 14 ))
            , noticeBoards =
                Array.fromList
                    [   
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [ 
                        ]
                    )
            , keyPressed = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
